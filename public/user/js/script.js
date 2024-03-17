

var responsiveSlider = function () {

  var slider = document.getElementById("slider");
  if (slider) {
    var sliderWidth = slider.offsetWidth;
    var sliderWidth = slider.offsetWidth;
    var slideList = document.getElementById("slideWrap");
    var count = 1;
    var items = slideList.querySelectorAll("li").length;
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");

    window.addEventListener('resize', function () {
      sliderWidth = slider.offsetWidth;
    });

    var prevSlide = function () {
      if (count > 1) {
        count = count - 2;
        slideList.style.left = "-" + count * sliderWidth + "px";
        count++;
      }
      else if (count = 1) {
        count = items - 1;
        slideList.style.left = "-" + count * sliderWidth + "px";
        count++;
      }
    };

    var nextSlide = function () {
      if (count < items) {
        slideList.style.left = "-" + count * sliderWidth + "px";
        count++;
      }
      else if (count = items) {
        slideList.style.left = "0px";
        count = 1;
      }
    };

    next.addEventListener("click", function () {
      nextSlide();
    });

    prev.addEventListener("click", function () {
      prevSlide();
    });

    setInterval(function () {
      nextSlide()
    }, 5000);
  }


};

window.onload = function () {
  responsiveSlider();
}




// tabs for car body types


function carBody(car, carType) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(carType).style.display = "block";
  car.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpencar").click();




// tabs for bikes types


function bikeType(bike, bikeType) {
  var i, tabcontentbike, tablinksbike;
  tabcontentbike = document.getElementsByClassName("tabcontentbike");
  for (i = 0; i < tabcontentbike.length; i++) {
    tabcontentbike[i].style.display = "none";
  }
  tablinksbike = document.getElementsByClassName("tablinksbike");
  for (i = 0; i < tablinksbike.length; i++) {
    tablinksbike[i].className = tablinksbike[i].className.replace(" active", "");
  }
  document.getElementById(bikeType).style.display = "block";
  bike.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpenbike").click();


// -----------------------------------------------------------------------------------------Get current year

document.getElementById("year").innerHTML = new Date().getFullYear();



//////////////////////////////////////////////// side menu mobile / Tab
function openNav() {
  document.getElementById("mySidepanel").style.right = "0";
}
function closeNav() {
  document.getElementById("mySidepanel").style.right = "-100%";
}

/////////////////////////////////////////////////// side menu mobile / Tab

function myFilter() {
  document.getElementById("myfilter").style.display = "flex";
}

function closeFilter() {
  document.getElementById("myfilter").style.display = "none";
}



//add wisHList Function

// JavaScript function to handle wishlist form submission and update UI
// async function handleWishlistSubmission(productId) {
//   const wishlistButton = document.getElementById('wishlistButton');
//   const wishlistIcon = document.getElementById('wishlistIcon');
//   const wishlistStatusElement = document.getElementById('wishlistStatus');

//   try {
//     // Make an API call to update the wishlist status
//     const response = await fetch('/wishList', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // Include any additional headers if needed
//       },
//       body: JSON.stringify({ _id: productId }),
//       // Include any additional request parameters if needed
//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (data.success) {
//         // Update the UI based on the wishlist status
//         wishlistStatusElement.textContent = 'Added';
//         wishlistIcon.className = 'fa-regular fa-heart'; // Change to filled heart icon
//         wishlistIcon.style.color = 'red';
//         wishlistButton.style.color = 'red';
//       } else {
//         console.error(data.message);
//       }
//     } else {
//       console.error('Failed to update wishlist status');
//     }
//   } catch (error) {
//     console.error('Error during API call:', error);
//   }
// }

// // Example usage: Call this function on form submission
// document.getElementById('wishlistForm').addEventListener('submit', function (event) {
//   event.preventDefault(); // Prevent the default form submission
//   const productId = this.querySelector('[name="_id"]').value;
//   handleWishlistSubmission(productId);
// });


// document.addEventListener("DOMContentLoaded", function () {
//   const filterButton = document.getElementById("filterButton");
//   if (filterButton) {
//     filterButton.addEventListener("click", applyFilters);
//   }
//   function applyFilters() {
//     const filterForm = document.getElementById("filterForm");
//     const formData = new FormData(filterForm);

//     const filters = {};
//     formData.forEach((value, key) => {
//       filters[key] = value;
//     });

//     fetch('/shop', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(filters),
//     })
//       .then(response => response.json())
//       .then(data => {
//         const shopProductGrid = document.getElementById('shopProductGrid');
//         if (shopProductGrid) {
//           shopProductGrid.innerHTML = '';

//           data.listings.forEach(listing => {
//             const productBox = document.createElement('div');
//             productBox.classList.add('product-box');
//             shopProductGrid.appendChild(productBox);
//           });
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }

//   // Add an event listener for the button click


//   // ... Other code

//   applyFilters(); // Call applyFilters once when the page loads
// });


async function removeFromWishlist(listingId) {
  try {
    const response = await fetch('/wishlist/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: listingId })
    });

    const result = await response.json();

    if (result.success) {
      // If successful, remove the listing from the DOM
      const listingElement = document.getElementById('listing_' + listingId);
      if (listingElement) {
        listingElement.remove();
      }

      // Check if wishlist is empty after removal
      const wishlistContainer = document.getElementById('wishlist-container');
      if (!wishlistContainer || wishlistContainer.children.length === 0) {
        // Display a message indicating that the wishlist is empty
        const emptyWishlistMessage = document.createElement('div');
        emptyWishlistMessage.className = 'empty-wishlist-message';
        emptyWishlistMessage.innerText = 'Your wishlist is empty.';
        wishlistContainer.appendChild(emptyWishlistMessage);
      }
    } else {
      // Handle error if needed
      console.error('Error removing from wishlist:', result.message);
    }
  } catch (error) {
    // Handle error if needed
    console.error('Error removing from wishlist:', error);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const priceLowToHighRadio = document.getElementById('low-to-high');
  const priceHighToLowRadio = document.getElementById('high-to-low');
  const shopProductGrid = document.querySelector('.shop-product-grid');
  const allListings = JSON.parse('<%- JSON.stringify(allListings) %>');

  // Function to render listings based on selected filter and sort
  function renderListings() {
    let filteredListings = [...allListings];

    // Filter based on price
    if (priceLowToHighRadio.checked) {
      filteredListings.sort((a, b) => a.price - b.price);
    } else if (priceHighToLowRadio.checked) {
      filteredListings.sort((a, b) => b.price - a.price);
    }

    // Clear previous listings
    shopProductGrid.innerHTML = '';

    // Render filtered listings
    filteredListings.forEach(listing => {
      const productBox = document.createElement('div');
      productBox.classList.add('product-box');

      const productImg = document.createElement('div');
      productImg.classList.add('product-img');
      const img = document.createElement('img');
      img.src = listing.images[0].url;
      img.alt = '';
      productImg.appendChild(img);

      const productDt = document.createElement('div');
      productDt.classList.add('product-dt');

      const productNameWishlist = document.createElement('div');
      productNameWishlist.classList.add('product-name-wishlist');

      const productName = document.createElement('div');
      productName.classList.add('product-name');
      const h3 = document.createElement('h3');
      h3.textContent = listing.brand;
      const p = document.createElement('p');
      p.textContent = listing.model;
      productName.appendChild(h3);
      productName.appendChild(p);

      const wishlist = document.createElement('div');
      wishlist.classList.add('wishlist');
      const wishlistImg = document.createElement('img');
      wishlistImg.src = '/user/icons/wishlist.png';
      wishlistImg.alt = '';
      wishlist.appendChild(wishlistImg);

      productNameWishlist.appendChild(productName);
      productNameWishlist.appendChild(wishlist);

      const price = document.createElement('p');
      price.classList.add('price');
      price.innerHTML = `&#8377; ${listing.price.toLocaleString('en-IN')}`;

      const ul = document.createElement('ul');
      const li1 = document.createElement('li');
      li1.textContent = `${listing.price.toLocaleString('en-IN')} KM`;
      const li2 = document.createElement('li');
      li2.classList.add('center');
      li2.textContent = listing.buying;
      const li3 = document.createElement('li');
      li3.textContent = listing.fuelType;

      ul.appendChild(li1);
      ul.appendChild(li2);
      ul.appendChild(li3);

      productDt.appendChild(productNameWishlist);
      productDt.appendChild(price);
      productDt.appendChild(ul);

      productBox.appendChild(productImg);
      productBox.appendChild(productDt);

      shopProductGrid.appendChild(productBox);
    });
  }

  // Event listener for radio button change
  priceLowToHighRadio.addEventListener('change', renderListings);
  priceHighToLowRadio.addEventListener('change', renderListings);

  // Initial render
  renderListings();
});
