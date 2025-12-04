
import { useFetcher } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import style from "./_index/styles.module.css";
import  "./_index/product.css";




export default function AppProduct (){
    const [productData, setProductData] =  useState([]);

async function getData() {
  const url = "https://api.escuelajs.co/api/v1/products";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result,"result data");
    setProductData(result)
  } catch (error) {
    console.error(error.message);
  }
}

    useEffect(() => {
getData();
        return () => {

        }
    }, [])

     console.log(productData,"result productData");

    return (
      <s-section className="productSection" padding="base" heading="Product store dashboard">
        <s-paragraph>Below is a list of Products.</s-paragraph>
        <h2 className={style.newHead}> New heading</h2>
        <div className="productGridSection">
            {
               productData.length > 0 &&
               productData.map(item => {
                return (
                     <div padding="base" className="box">
                        <img
                        className="productImg"
                        alt="White sneakers"
                        src={`${item.images.length > 0 ? item.images[0] : item.images}`}
                        />
                          <span className="title">{item.title}</span>
                          <p className="descriptionData">{item.description}</p>
                          <span className="priceTag">Price: {item.price}</span>
                     </div>
                )
               })  
            }
        </div>
        </s-section>
    )
}