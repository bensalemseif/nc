import React, { forwardRef } from 'react';
import logo from "../ass/logo.png"
const OrderDetailsToPrint = forwardRef(({ selectedOrder }, ref) => (

  <div ref={ref} className="bg-white rounded-lg  px-8 py-10 max-w-xl mx-auto">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <img
          className="h-24 w-24 mr-2"
          src={logo}
          alt="Logo"
        />
      </div>
      <div className="text-gray-700 text-right">
        <div className="font-bold text-xl mb-2">INVOICE</div>
        <div className="text-sm">Date: {new Date(selectedOrder?.createdAt).toLocaleDateString()}</div>
        <div className="text-sm">Invoice #: {selectedOrder?.id}</div>

      </div>
    </div>
    <div className="border-b-2 border-gray-300 pb-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">Bill To:</h2>
      <div className="text-gray-700 mb-2">{selectedOrder?.user}</div>
      <div className="text-gray-700 mb-2">{selectedOrder?.userAddress}</div>
      <div className="text-gray-700 mb-2">{selectedOrder?.userEmail}</div>
      <div className="text-gray-700">{selectedOrder?.userPhone}</div>
    </div>
    <table className="w-full text-left mb-8">
      <thead>
        <tr>
          <th className="text-gray-700 font-bold uppercase py-2">Product Name</th>
          <th className="text-gray-700 font-bold uppercase py-2">Quantity</th>
          <th className="text-gray-700 font-bold uppercase py-2">Price</th>

          <th className="text-gray-700 font-bold uppercase py-2">Total</th>
          <th className="text-gray-700 font-bold uppercase py-2">gift</th>

        </tr>
      </thead>
      <tbody>
      {selectedOrder?.products?.map((product, index) => (
  <tr key={index}>
    {console.log(product)}

    <td className="py-4 text-gray-700">{product?.productName}</td>
    <td className="py-4 text-gray-700">{product?.quantity}</td>
    <td className="py-4 text-gray-700">{product?.productPrice} TND</td>
    <td className="py-4 text-gray-700">{(product?.productPrice * product?.quantity)} TND</td>

    {/* Mapping through gifts */}
    <td className="py-4 text-gray-700">
      {product?.gifts?.map((giftproduct, i) => (
        <div key={giftproduct._id}>
          <h1 className="py-4 text-gray-700">{giftproduct?.gift?.giftName}</h1>
        </div>
      ))}
    </td>
  </tr>
))}
      </tbody>
    </table>
    <div className="flex justify-end mb-8">
      <div className="text-gray-700">
        {selectedOrder?.totalPrice} TND
      </div>
    </div>
    <div className="">
   
      <div className="">

</div>

    </div>
    <div className="flex justify-end mb-8">
      <div className="text-gray-700 mr-2">Total:</div>
      <div className="text-gray-700 font-bold text-xl">
        {(
          selectedOrder?.totalPrice
        )}TND
      </div>
    </div>
    <div className="border-t-2 border-gray-300 pt-8 mb-8">
      <div className="text-gray-700 mb-2">Payment is due within 30 days. Late payments are subject to fees.</div>
      <div className="text-gray-700 mb-2">Please make checks payable to Your Company Name and mail to:</div>
      <div className="text-gray-700">123 Main St., Anytown, USA 12345</div>
    </div>
  </div>
));

export default OrderDetailsToPrint;
