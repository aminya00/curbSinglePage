let youMayAlsoLike = $.querySelector(".you-may-also-like");
let singleProductBigImg = $.querySelector(".single-product-big-img");
let singleProductLittleImgContainer = $.querySelector(
  ".single-product-little-img-container"
);
let singleProductInfoContainer = $.querySelector(
  ".single-product-info-container"
);
let singleProductNameInfo = $.querySelector(".single-product-name-info");
let selectProductPages = $.querySelector(".select-product-pages");
let singleProductDetailContainer = $.querySelector(
  ".single-product-detail-container"
);
let sizeCollector = [];
let singleProductSizeGuide = $.querySelector(".single-product-size-guide");
let sizeGuidePageContainer = $.querySelector(".size-guide-page-container");
let sizeGuideExitBtn = $.querySelector(".size-guide-exit-btn");

let singleProductAddBasketBtn = $.querySelector(".single-product-add-basket-btn");
let bigImgSrcTemp=null


    


function singleImgFetch(productName) {
  fetch(
    "https://api.backendless.com/E00D2420-4B94-448F-91C9-CD735A45C196/2360764B-B7DE-46FA-B8FB-8DEEF590B988/data/products?pagesize=100"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      singleProductBigImg.innerHTML = "";
      singleProductLittleImgContainer.innerHTML = "";
      singleProductNameInfo.innerHTML = "";
      selectProductPages.innerHTML = "";
      youMayAlsoLike.innerHTML = "";
      singleProductDetailContainer.innerHTML = "";
      sizeCollector = [];
      data.forEach((product) => {
        if (product.name == productName) {
          singleBigImgMaker(singleProductBigImg, product.imgUrl[0]);

          product.imgUrl.forEach((img) => {
            if (!(product.imgUrl[0] == img)) {
              singleLittleImgMaker(singleProductLittleImgContainer, img);
            }
          });

          singleProductInfoMaker(
            singleProductNameInfo,
            product.category,
            product.name
          );
          if(!product.isAvail){
            singleProductPriceMakerNotAvail(singleProductNameInfo)
          }else{
            singleProductPriceMaker(
              singleProductNameInfo,
              enNumToPerNum(product.price[0])
            );
  
            if (product.price[1]) {
              let singleProductPrice = $.querySelector(".single-product-price");
              singleProductPrice.innerHTML = "";
              singleOffPriceMaker(
                singleProductPrice,
                enNumToPerNum(product.price[0]),
                enNumToPerNum(product.price[1]),
                enNumToPerNum(offPercent(product.price[0], product.price[1]))
              );
          }

          
          }

          product.size.forEach((size) => {
            productSizeBoxMaker(selectProductPages, size);
            sizeCollector.push(size);
          });

          data.forEach((product2) => {
            if (product2.category == product.category) {
              if(!product2.isAvail){
                swiperItemsMakerNotAvail(
                  youMayAlsoLike,
                  product2.imgUrl[0],
                  product2.category,
                  product2.name)
              }else if (product2.price[1]) {
                swiperItemsMakerWithOff(
                  youMayAlsoLike,
                  product2.imgUrl[0],
                  enNumToPerNum(
                    offPercent(product2.price[0], product2.price[1])
                  ),
                  product2.category,
                  product2.name,
                  enNumToPerNum(product2.price[0]),
                  enNumToPerNum(product2.price[1])
                );
              } else {
                swiperItemsMaker(
                  youMayAlsoLike,
                  product2.imgUrl[0],
                  product2.category,
                  product2.name,
                  enNumToPerNum(product2.price[0])
                );
              }
            }
          });

          singleProductDetail(
            singleProductDetailContainer,
            product.category,
            product.gender.join(" و "),
            product.color,
            sizeCollector.join(" ").toUpperCase()
          );
        }
      });
      let productNameArray = $.querySelectorAll(".product-name");
      let  singleProductName= $.querySelector(".single-product-name");
    
    let wishListTransaction=wishListResultDB.transaction("wishList","readwrite")
    let wishListStore=wishListTransaction.objectStore("wishList")
    let wishListRequest=wishListStore.getAll()
    wishListRequest.addEventListener("success",(e)=>{
      let wishListArr=e.target.result
      let singleWishListFlag=wishListArr.some((product4) => {
        return product4.name == singleProductName.innerHTML
      });
      if (singleWishListFlag) {
        singleProudctLikeBtn.classList.add(
          "heart-fill"
        );
        singleProudctLikeBtn.innerHTML = `<lord-icon
  src="https://cdn.lordicon.com/ulnswmkk.json"
  trigger="hover"
  colors="primary:#48f70d"
  style="width:32px;height:32px">
</lord-icon>`;
singleProudctLikeBtn.classList.add("heart-fill");
      }else{
        singleProudctLikeBtn.innerHTML = `<lord-icon
  src="https://cdn.lordicon.com/xyboiuok.json"
  trigger="morph"
  state="morph-heart"
  colors="primary:#48f70d"
  class="lord-icon"
  style="width:32px;height:32px">
  </lord-icon>`;
singleProudctLikeBtn.classList.remove("heart-fill");
      }
    })
    
      isProductInWishlist(productNameArray)
    
      preLoaderDisappear()  
    });


}

function productPageOnclickEvent(e) {
  for (let sizeBox of e.target.parentElement.children) {
    if (sizeBox.className.includes("product-page-active")) {
      sizeBox.classList.remove("product-page-active");
    }
    e.target.classList.add("product-page-active");
  }
}
singleProductSizeGuide.addEventListener("click", () => {
  sizeGuidePageContainer.style.left = "0px";
});
sizeGuideExitBtn.addEventListener("click", () => {
  sizeGuidePageContainer.style.left = "-100000px";
});

let isSelectSize=null
let selectedSize=null
singleProductAddBasketBtn.addEventListener("click",(e)=>{
  for (let sizeBox of e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild.children) {
    if (sizeBox.className.includes("product-page-active")){
      isSelectSize=true
      selectedSize=sizeBox.innerHTML
      break;
    }else{
      isSelectSize=false
    }
  }
  if(isSelectSize){
    addToBasketDatabase(e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.nextElementSibling.innerHTML,selectedSize)
    
  }else{
    iziToast.show({
      message: "لطفا سایز مورد نظر را انتخاب کنید",
      position: "topRight",
      timeout: 2000,
      rtl: true,
      zindex: 999999999,
      backgroundColor: "#e23636",
      messageColor: "#fff",
      theme: "dark",
      progressBarColor: "#fff",
      progressBar: false,
    });
  }
})
function littleImgOnClick(e){
  bigImgSrcTemp=e.target.parentElement.parentElement.previousElementSibling.firstElementChild.src
  e.target.parentElement.parentElement.previousElementSibling.firstElementChild.src=e.target.src
  e.target.src=bigImgSrcTemp
}


let locationSearchParams=new URLSearchParams(location.search)
singleImgFetch(locationSearchParams.get("k1"));