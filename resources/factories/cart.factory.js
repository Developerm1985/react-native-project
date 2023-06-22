// import { updateCartMerchant } from "../actions/cart.actions";

// class Cart {
//   constructor(cart) {
//     Object.keys(cart).map((key) =>
//       typeof cart[key] !== "function" ? (this[key] = cart[key]) : false
//     );
//   }

//   getMerchantTotal = (merchantId) => {
//     let total = 0;
//     if (this.merchants[merchantId] && this.merchants[merchantId].items)
//       this.merchants[merchantId].items.forEach(
//         (item) => (total += +item.quantity * +item.price)
//       );

//     return total;
//   };

//   getItemCount = (merchantId) => {
//     let count = 0;
//     if (this.merchants[merchantId] && this.merchants[merchantId].items)
//       this.merchants[merchantId].items.forEach(
//         (item) => (count += item.quantity)
//       );

//     return count;
//   };

//   getCartMerchantCount = () => {
//     return Object.keys(this.merchants).length;
//   };

//   findItem = (product) => {
//     if (
//       product.store_name &&
//       product.store_name.id &&
//       this.merchants &&
//       this.merchants[product.store_name.id]
//     )
//       return this.merchants[product.store_name.id].items.find(
//         (item) => item !== null && item.id === product.id
//       );

//     return null;
//   };

//   addToCart = ({ product, quantity }) => {
//     const merchant = product.store_name;
//     if (merchant) {
//       let cartMerchant = this.merchants[merchant.id]
//         ? this.merchants[merchant.id]
//         : merchant;
//       cartMerchant = JSON.parse(JSON.stringify(cartMerchant)); //this method is for cloning deep objects

//       if (!cartMerchant.items) cartMerchant.items = [];
//       const item = cartMerchant.items.find((item) => item.id === product.id);

//       if (quantity > 0) {
//         if (item) item.quantity = quantity;
//         else {
//           const newProduct = JSON.parse(JSON.stringify(product));
//           // remove extra item payload
//           delete newProduct.image_paths;
//           delete newProduct.images;
//           delete newProduct.store_name;
//           cartMerchant.items.push({ ...product, quantity });
//         }
//       } else if (item)
//         cartMerchant.items = cartMerchant.items.filter(
//           (item) => item.id !== product.id
//         );

//       updateCartMerchant(cartMerchant);
//     }
//   };
// }

// export default Cart;
