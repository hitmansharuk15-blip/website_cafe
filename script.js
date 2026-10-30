let open=false;

function toggleNav(){
  const side = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if(!open){
    side.style.left="0";
    overlay.style.display="block";
  }else{
    side.style.left="-220px";
    overlay.style.display="none";
  }
  open=!open;
}


let menu = JSON.parse(localStorage.getItem("menu")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* LOAD MENU */
const menuBox = document.getElementById("menuItems");

if(menuBox){
  menuBox.innerHTML = "";
  menu.forEach((item,index)=>{
    const cartItem = cart.find(c => c.name === item.name);
    const qty = cartItem ? cartItem.qty : 0;

    menuBox.innerHTML += `
      <div class="card">
        <img src="${item.img}">
        <p>${item.name} – ₹${item.price}</p>

        <div class="qty-box">
          <button onclick="decrease('${item.name}')">−</button>
          <span>${qty}</span>
          <button onclick="increase('${item.name}',${item.price})">+</button>
        </div>
      </div>
    `;
  });
}


/* ADMIN LIST */
const adminList=document.getElementById("adminList");
if(adminList){
adminList.innerHTML="";
menu.forEach((i,index)=>{
adminList.innerHTML+=`
<li>${i.name} ₹${i.price}
<button onclick="editItem(${index})">✏️</button>
<button onclick="deleteItem(${index})">❌</button>
</li>`;
});
}

/* ADD ITEM */
function addMenuItem(){
const name=itemName.value;
const price=itemPrice.value;
const file=itemImg.files[0];
if(!name||!price||!file) return alert("Fill all");

const reader=new FileReader();
reader.onload=e=>{
menu.push({name,price:Number(price),img:e.target.result});
localStorage.setItem("menu",JSON.stringify(menu));
location.reload();
};
reader.readAsDataURL(file);
}

/* EDIT */
function editItem(i){
let n=prompt("Name",menu[i].name);
let p=prompt("Price",menu[i].price);
if(n&&p){
menu[i].name=n;
menu[i].price=Number(p);
localStorage.setItem("menu",JSON.stringify(menu));
location.reload();
}
}

/* DELETE */
function deleteItem(i){
menu.splice(i,1);
localStorage.setItem("menu",JSON.stringify(menu));
location.reload();
}

/* CART */
function addToCart(name,price){
let i=cart.find(x=>x.name==name);
if(i) i.qty++; else cart.push({name,price,qty:1});
updateCart();

event.currentTarget.classList.add("pop");
setTimeout(()=>event.currentTarget.classList.remove("pop"),200);

}

function updateCart(){
let list=document.getElementById("cartList");
let total=0;
if(!list) return;
list.innerHTML="";
cart.forEach(i=>{
let amt=i.qty*i.price;
total+=amt;
list.innerHTML+=`<li>${i.name} x ${i.qty} = ₹${amt}</li>`;
});
document.getElementById("total").innerText=total;
localStorage.setItem("cart",JSON.stringify(cart));
}
updateCart();

/* PAYMENT TOTAL */
const payTotal=document.getElementById("payTotal");
if(payTotal){
  let sum=0;
  cart.forEach(i=>sum+=i.qty*i.price);
  payTotal.innerText=sum;
}


/* FLOW */
function goToPayment(){location.href="payment.html";}
function paymentDone(){location.href="billing.html";}

/* BILL */
const bill = document.getElementById("billItems");

if(bill){

  // Bill Number
  document.getElementById("billNo").innerText =
    "CC" + Math.floor(100000 + Math.random() * 900000);

  // Date & Time
  document.getElementById("billDate").innerText =
    new Date().toLocaleString();

  let total = 0;

  cart.forEach((item,index)=>{
    const amt = item.qty * item.price;
    total += amt;

    bill.innerHTML += `
      <tr style="animation-delay:${index * .15}s">
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${amt}</td>
      </tr>
    `;
  });

  document.getElementById("billTotal").innerText = total;

  localStorage.removeItem("cart");
}


/* PDF */
function downloadPDF(){
  const bill = document.getElementById("billBox");

  bill.style.display = "block";   // force visible

  html2pdf(bill,{
    margin: 10,
    filename: "Cafe_Receipt.pdf",
    html2canvas:{scale:2},
    jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}
  });
}



/* quantity logic */
function increase(name, price){
  let item = cart.find(i => i.name === name);
  if(item) item.qty++;
  else cart.push({name, price, qty:1});
  updateCart();
  refreshMenu();
}

function decrease(name){
  let item = cart.find(i => i.name === name);
  if(!item) return;

  item.qty--;
  if(item.qty === 0){
    cart = cart.filter(i => i.name !== name);
  }
  updateCart();
  refreshMenu();
}

function refreshMenu(){
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}
