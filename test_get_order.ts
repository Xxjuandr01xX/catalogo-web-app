import { get_order_details } from './src/app/services/CartService';

async function test() {
    try {
        console.log("Fetching order details for id 2...");
        const items = await get_order_details(2);
        console.log("Items found:", items.length);
        console.log(JSON.stringify(items, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
