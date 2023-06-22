import DashboardRoute from "./tab.route";
import Food from "../../modules/Food";
import Merchant from "../../modules/Merchant/";
import Product from "../../modules/Product/";
import About from "../../modules/About/";
import OrderDetails from "../../modules/Orders/Details/";
import Search from "../../modules/Search/";
import Location from "../../modules/Location/";
import MyCart from "../../modules/MyCart/";
import MyCartMerchants from "../../modules/MyCart/merchants";

// AUTH GROUP
import Landing from "../../modules/Authentication/Landing";
import Login from "../../modules/Authentication/Login";
import OtpVerification from "../../modules/Authentication/OtpVerification";
import Signup from "../../modules/Authentication/Signup";
import Loading from "../../modules/Loading/";

//CHECKOUT GROUP
import Checkout from "../../modules/Checkout/";
import OneMoreStep from "../../modules/OneMoreStep/";
import CheckoutLoading from "../../modules/Checkout/loading";
import ManageAddress from "../../modules/Dashboard/components/ManageAddress";
import EditAddress from "../../modules/Dashboard/components/EditAddress";
import ParcelDelivery from "../../modules/ParcelDelivery";
import LoadingCheckout from "../../modules/Loading/";
import DeliveryComplete from "../../modules/DeliveryComplete";
import { TrackParcel } from "../../modules/TrackParcel/index";
import PickUp from "../../modules/PickUp";
import DocScanner from "../../modules/OneMoreStep/components/DocScanner";
import DropOff from "../../modules/DropOff";
import GcashModule from "../../modules/Payment/GcashModule";
import AddParcelAddress from "../../modules/AddParcelAddress";
import DeliveryOption from "../../modules/DeliveryOption";
import EditEmailMobile from "../../modules/Authentication/EditEmailMobile";
import EditEmailMobileOtpVerification from "../../modules/Authentication/EditEmailMobileOtpVerification";
import { SeeAll } from "../../modules/SeeAll";
import AddressMap from "../../modules/Dashboard/components/AddressMap";
import EditProfile from "../../modules/Authentication/EditProfile";
import CompanyCondition from "../../modules/Authentication/components/CompanyCondition";
import Orders from "../../modules/Orders";

export default routes = [
  {
    key: "addparceladdress",
    name: "AddParcelAddress",
    component: AddParcelAddress,
  },
  { key: "landing", name: "Landing", component: Landing },
  { key: "seeall", name: "SeeAll", component: SeeAll },
  { key: "loading", name: "Loading", component: Loading },
  { key: "login", name: "Login", component: Login },
  { key: "parceldelivery", name: "ParcelDelivery", component: ParcelDelivery },
  {
    key: "otpverification",
    name: "OtpVerification",
    component: OtpVerification,
  },
  { key: "signup", name: "Signup", component: Signup },
  {
    key: "dashboard",
    name: "DashboardRoute",
    component: DashboardRoute,
    iconName: "home",
  },
  { key: "ManageAddress", name: "ManageAddress", component: ManageAddress },
  { key: "EditAddress", name: "EditAddress", component: EditAddress },
  {
    key: "EditProfile",
    name: "EditProfile",
    component: EditProfile,
  },
  { key: "food", name: "Food", component: Food },
  { key: "merchant", name: "Merchant", component: Merchant },
  { key: "product", name: "Product", component: Product },
  { key: "about", name: "About", component: About },
  { key: "orderDetails", name: "OrderDetails", component: OrderDetails },
  { key: "search", name: "Search", component: Search },
  { key: "deliveryOption", name: "DeliveryOption", component: DeliveryOption },
  {
    key: "checkoutmerchants",
    name: "MyCartMerchants",
    component: MyCartMerchants,
  },
  { key: "location", name: "Location", component: Location },
  { key: "mycart", name: "MyCart", component: MyCart },
  { key: "checkout", name: "Checkout", component: Checkout },
  { key: "onemorestep", name: "OneMoreStep", component: OneMoreStep },
  {
    key: "EditEmailMobile",
    name: "EditEmailMobile",
    component: EditEmailMobile,
  },
  {
    key: "EditEmailMobileOtpVerification",
    name: "EditEmailMobileOtpVerification",
    component: EditEmailMobileOtpVerification,
  },
  {
    key: "deliverycomplete",
    name: "DeliveryComplete",
    component: DeliveryComplete,
  },
  { key: "trackparcel", name: "TrackParcel", component: TrackParcel },
  { key: "pickup", name: "Pickup", component: PickUp },
  { key: "dropoff", name: "DropOff", component: DropOff },

  {
    key: "loadingcheckout",
    name: "LoadingCheckout",
    component: LoadingCheckout,
  },
  {
    key: "orders",
    name: "Orders",
    component: Orders,
  },

  {
    key: "DocScanner",
    name: "DocScanner",
    component: DocScanner,
  },
  {
    key: "GcashModule",
    name: "GcashModule",
    component: GcashModule,
  },
  {
    key: "AddressMap",
    name: "AddressMap",
    component: AddressMap,
  },
  {
    key: "CompanyCondition",
    name: "CompanyCondition",
    component: CompanyCondition,
  },
];
