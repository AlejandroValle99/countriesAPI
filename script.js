


// const prueba = axios.get("https://restcountries.com/v3.1/all")
//     .then(res=>{
//         console.log("Response", res.data[0].flags.png);
//         png = res.data[30].flags.png;

//         cardContainer(png);
//         cardContainer(png);
//         cardContainer(png);
//         cardContainer(png);
//         cardContainer(png);
//         cardContainer(png);

//     })



const dataFetch = async () =>{
    try{
        const res = await axios.get("https://restcountries.com/v3.1/all")
         return res.data;
    }

    catch{
        return "Error requesting data";
    }
}

const display = async () =>{
    const countriesInfo = await dataFetch();
    if(window.location.pathname === "/index.html"){
    cardContainer(countriesInfo);
    searchDisplay(countriesInfo);
    regionDisplay(countriesInfo);
    countryLink();
    }

    if (window.location.pathname === "/singleCountry.html"){
        
        newPage(countriesInfo, "countryName");
        borderClick(countriesInfo);
        backPageButton();
    }
  
}


display();

const searchForm = document.querySelector("#searchForm");
const allCards = document.querySelector("#allCards");


const searchDisplay = (countries) => {

    function capitalize(string) {
        // console.log(string.indexOf(" "));
        if(string.indexOf(" ") > 0 ){
            // console.log("in loop");
            dissectedWord = string.split(" ");
            firstHalf = dissectedWord[0].charAt(0).toUpperCase() + dissectedWord[0].slice(1);
            secondHalf = dissectedWord[1].charAt(0).toUpperCase() + dissectedWord[1].slice(1);
            return (firstHalf + " " + secondHalf);
             }
        else{
        return string.charAt(0).toUpperCase() + string.slice(1);
            }
    }


    searchForm.addEventListener("submit", function (e){
        e.preventDefault();
        searchedCountry = this.elements.country.value;
        searchedCountryCap = capitalize(searchedCountry);
        if(searchedCountryCap === ""){
                allCards.replaceChildren();
                cardContainer(countries);
        }

        else{
        
                const result = countries.filter( c => {
                    return c.name.common === searchedCountryCap;
                })
                allCards.replaceChildren();
                cardContainer(result[0], isSearch = true);
            }
        
        })

}

const selectRegion = document.querySelector("#selectRegion");
const regionDisplay = (countries) =>{
    selectRegion.addEventListener("change", function (event) {
         regionInput = event.target.value;
            // console.log(regionInput);

        if(regionInput === "Reset"){
            allCards.replaceChildren();
            cardContainer(countries);
            searchDisplay(countries);
        }

        else{
         filteredCountries = countries.filter(r => {
            return r.region === regionInput;
         })
         allCards.replaceChildren();
         cardContainer(filteredCountries);
         searchDisplay(filteredCountries);
        //  console.log(result);
        }

        
    })

}



const cardContainer = (countries, isSearch = false) =>{


    const makeCard = (country) =>{
            cdiv = document.createElement("DIV");
            cdiv.classList.add("col");
            cdiv.setAttribute("id","#cards");
            
            const div = document.createElement("DIV");
            div.classList.add("card");
            cdiv.appendChild(div);

            const img = document.createElement("IMG");
            img.src = country.flags.png;
            img.classList.add("card-img-top");
            div.appendChild(img);
    
            const divChild = document.createElement("DIV");
            div.classList.add("card-body");
            div.appendChild(divChild);
        
            const cardTitle = document.createElement('H5');
            const link = document.createElement("A");
            link.href = "singleCountry.html";
            cardTitle.classList.add("card-title", "text-center", "mt-3");
            link.innerText = `${country.name.common}`;
            link.classList.add("link-primary")
            cardTitle.appendChild(link);
            divChild.appendChild(cardTitle);
            
            // const par = document.createElement('P');
            // par.classList.add("card-text");
            // par.innerText = "Hola";
            // divChild.appendChild(par);
    
            const ul = document.createElement("UL");
            ul.classList.add("list-group","list-group-flush");
    
                const pop = document.createElement("LI");
                pop.classList.add("list-group-item");
                pop.innerText = `Population: ${country.population}`;
    
                const region = document.createElement("LI");
                region.classList.add("list-group-item");
                region.innerText = `Region: ${country.region}`;
    
                const capital = document.createElement("LI");
                capital.classList.add("list-group-item");
                capital.innerText = `Capital: ${country.capital}`;
    
                ul.appendChild(pop);
                ul.appendChild(region);
                ul.appendChild(capital);
    
            divChild.appendChild(ul);
    
            document.body.children.countries.children[0].appendChild(cdiv);
    }

    if(isSearch === true){
        makeCard(countries);
    }
    else{
        for (let country of countries){
            makeCard(country);
        }
    }

}



const countryLink = () =>{
    allCards.addEventListener("click", function(event){
        // event.preventDefault();
        if(event.target.nodeName === "A"){
            const countryName = event.target.innerText;
            sessionStorage.setItem("countryName", countryName);       
            }
    })
}


const newPage = (countries, nameClick) =>{

    const name = sessionStorage.getItem(nameClick);

    const result = countries.filter(c => {
        return c.name.common === name;
    })


    // const borderCountries = [];
    // countries.forEach(val => border.includes(val.cca3) && borderCountries.push(val));
    

    const imgContainer = document.querySelector("#imgContainer");
    const cardBody = document.querySelector("#cardBody");

    const img = document.createElement("IMG");
    img.classList.add("img-fluid", "rounded-start");
    img.setAttribute("id","#countryFlag");
    img.src = result[0].flags.png;
    imgContainer.appendChild(img);
   

    const countryTitle = document.createElement("H5");
    countryTitle.classList.add("card-title");
    countryTitle.innerText = `${result[0].name.common}`;
    cardBody.appendChild(countryTitle);
    
    const cardText = (characteristic,arr, isMultiple = false) =>{

        const paragraph = document.createElement("P");
        paragraph.classList.add("card-text");
        
        if(isMultiple){

            if(characteristic === "Border Countries"){

            
               const borderArr =  arr.map(v=>{
                    const anchor = document.createElement("A");
                    anchor.classList.add("text-primary")
                    anchor.setAttribute("href", "#");
                    anchor.innerText = v;
                    return anchor;
                }) 

                paragraph.innerHTML =`${characteristic}: ${borderArr.map(i=>{
                    return i.outerHTML;
                })}`
                
            }

            else{
            const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) === index)
            const duplicateElements = toFindDuplicates(arr);
            paragraph.innerText = `${characteristic}: ${duplicateElements.join(", ")}`;
            }
            
        }

        else{
            paragraph.innerText = `${characteristic}: ${arr}`;
        }

        cardBody.appendChild(paragraph);        

    }

    const nativeObj = Object.values(result[0].name.nativeName);
    const native = nativeObj.map(v => v.common);
    cardText("Native name", native, isMultiple = true);


    cardText("Population",result[0].population);
    cardText("Region", result[0].region);
    cardText("Sub Region",result[0].subregion);
    cardText("Capital",result[0].capital);
    cardText("Top Level Domain",result[0].tld);
    

    const currencyObj = Object.values(result[0].currencies);
    const currency = currencyObj.map(v=>v.name);
    cardText("Currencies",currency, isMultiple = true);


    const languagesObj = Object.values(result[0].languages);
    cardText("Languages",languagesObj, isMultiple = true);

    border = (result[0].borders);

    const borderCountries = countries.filter( c=>{
        return border.some(e=>{
            return e === c.cca3;
        })
    })


    const borderCountriesArr = borderCountries.map(v=>v.name.common);
    cardText("Border Countries", borderCountriesArr, isMultiple = true);

}



const borderClick = (countries) =>{
    const singleCountryCard = document.querySelector("#country");

    singleCountryCard.addEventListener("click", function(event){
        event.preventDefault();
        if(event.target.nodeName === "A"){
            const borderName = event.target.innerText;
            sessionStorage.setItem("borderName", borderName);   
            console.log(borderName);
            imgContainer.replaceChildren();
            cardBody.replaceChildren();
            newPage(countries, "borderName");   
            }
    })
}


const backPageButton = () =>{
    const backButton = document.querySelector("#backPage");
    backButton.addEventListener("click", function(){
        console.log("asies")
        window.location.pathname = "/index.html";
    })
}




const darkMode = () =>{
    // const navBar = document.querySelector("#navBar");
    const htmlElement = document.querySelector("html");
    const darkButton = document.querySelector("#darkMode");

    let bool = true;    
    darkButton.addEventListener("click", function(){
        bool = !bool;
        htmlElement.setAttribute("data-bs-theme", "dark");
        if(bool === true){
            htmlElement.removeAttribute("data-bs-theme"); 
        }
    })
     
}

darkMode();