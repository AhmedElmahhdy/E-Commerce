import { Cart, Product } from "../../../DB/collections-index.js";
import ErrorClass from "../../utils/Error-class.js";

// =============================== add to cart ========================
/**
 * @api /cart/add 
 * @quey => productID  , userId from token
 * check if product available to add in cart first
 * if available prepare a product object 
 * check user have cart or not have 
 * if have push product object to Product array and update subtotal price 
 * if not have create new cart and save 
 */
export const addToCart = async (req,res,next)=>{
    const userId = req.user._id
    const {productId,Quantity} = req.query

   // check is product exist and stock is greater than or equel Quantity
    const isProductExist = await Product.findOne({_id:productId,stock:{$gte:Quantity}})
    if(!isProductExist) return next(new ErrorClass("Product Not Available",404))

   // prepare product Object
    const productObject = {
            productId,
            Quantity,
            price:isProductExist?.appliedPrice
        }
    
    // check if cart exist or not
    const cartDoc = await Cart.findOne({userId})
    if (!cartDoc){ 
        // calculate subtotal price
        // const subTotal = (isProductExist.appliedPrice) *  Quantity 
        //prepare cart object to save
        const cart = new Cart({
            userId,
            Product:productObject,
           // subTotal
            })

            await cart.save()
           return res.status(201).json({message:"add is done", cartInfo:cart})
        }
    // check if this product exist in cart or not 
    const product =  cartDoc.Product.find(p=>p.productId == productId)
     if(product) return next(new ErrorClass("Product already Exist in Cart",404))
    // add product to cart and update subtotal price
    cartDoc.Product.push(productObject)
   // cartDoc.subTotal += productObject.price * Quantity

    await cartDoc.save()
   
    res.status(200).json({message:"add is done", cartInfo:cartDoc})

}

// =============================== update cart ==========================
/**
 * @api /cart/add/cartId
 * @param => cartId , userId from token
 * user can update Quantity only
 * check first if cart exist or not 
 * find index of product that user want to update quantity 
 * update and save 
 * subTotal price will be update before save by hook 
 */

export const updateCart = async (req,res,next)=>{
    const userId = req.user._id 
    const {cartId,productId,Quantity} = req.query

    const cart = await Cart.findOne({_id:cartId,userId})
    if(!cart) return next(new ErrorClass("no cart exist",404))
    const productIndex = cart.Product.findIndex(p=>p.productId == productId)
    if (productIndex == -1) return next(new ErrorClass("product not exist in cart",404))
   
    cart.Product[productIndex].Quantity = Quantity
    await cart.save()

    res.json({message:"update is done",cart})

}

// =============================== remove product from cat ===============================
/**
 * @api /cart/rmove
 * @query => productId , userId from token
 * check first if cart exist or not
 * fillter 
 * save
 * subTotal price will be update before save by hook 
 */ 

export const removeFromCart = async(req,res,next)=>{
    const userId = req.user._id
    const {productId}= req.query

   // check  if cart exist or not and has this product 
    const cart = await Cart.findOne({userId,'Product.productId':productId})
    if(!cart) return next(new ErrorClass("cart not Exist",404))
    
    // fillter 
    cart.Product = cart.Product.filter(p=>p.productId != productId)
    await cart.save()

    res.json({message:"remove is done"})

}


// ================================== get Cart =================================
/**
 * @api /cart/get
 * 
 */
export const getCart = async (req,res,next)=>{
    const userId= req.user._id

    const cart = await Cart.findOne({userId})
    if(!cart) return next(new ErrorClass("cart is empty",404))
    
    res.json(cart)
}

