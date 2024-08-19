import schedule from "node-schedule";
import { Coupon } from "../../DB/collections-index.js";
import { DateTime } from "luxon";

export const disableCoupon = () => {
    schedule.scheduleJob("0 59 23 * * *", async () => {
        const enabledCoupons = await Coupon.find({isEnabled: true});
        console.log("cron job is running");

        for(const coupon of enabledCoupons){
            if(DateTime.now() >= DateTime.fromJSDate(coupon.till)){
                coupon.isEnabled = false
                await coupon.save()
                console.log("coupon is disabled",coupon.couponCode);
            }

        }
       
       
})
}



export const enableCoupon = () => {
    schedule.scheduleJob("0 59 23 * * *", async () => {
        const enabledCoupons = await Coupon.find({isEnabled: false});
        console.log("cron job is running");

        for(const coupon of enabledCoupons){
            if(DateTime.now() <= DateTime.fromJSDate(coupon.from)){
                coupon.isEnabled = true
                await coupon.save()
                console.log("coupon is enabled",coupon.couponCode);
            }

        }
       
       
})
}
