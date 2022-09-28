import "../css/style.css"
import axios from "axios"
const _ = require("lodash")

// Global variables

let form = document.forms.city
let btn = form.elements.btn
let categoriesTitle = document.querySelector(".categories-title")
let categoriesDiv = document.querySelector(".categories")
let sumAndScore = document.querySelector(".sum-and-score")

// Event

btn.addEventListener("click", createElements)

// Function to get data

async function ApiCall(input) {

    try {

        let response = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${input.toLowerCase()}/scores/`)

        return response


    } catch (error) {

        if(error){
            alert("something went wrong, try again")
        }

    }
}

//Function to create elements

function createElements(e){

    e.preventDefault()

    let input = form.elements["city-input"].value

    if(/\s/.test(input)){
        input = input.replace(" ", "-")
    }

    //if statement to not block the code if input is empty

    if(input == ""){

        alert("You have to write the name of a city")

        //if statements to reset every value after a new research

        if(categoriesTitle !== ""){
            categoriesTitle.innerHTML = ""
        }

        if(categoriesDiv !== ""){
            categoriesDiv.innerHTML = ""
        }

        if(sumAndScore !== ""){
            sumAndScore.innerHTML = ""
        }

    }else{

        ApiCall(input).then(result => {

            //if statements to reset every value after a new research
        
            if(categoriesTitle !== ""){
                categoriesTitle.innerHTML = ""
            }
    
            if(categoriesDiv !== ""){
                categoriesDiv.innerHTML = ""
            }
    
            if(sumAndScore !== ""){
                sumAndScore.innerHTML = ""
            }
    
            // variables to get elements of the API call
    
            let categories = _.get(result, "data.categories", "") 
            let summary = _.get(result, "data.summary", "")
            let score = Math.floor(_.get(result, "data.teleport_city_score", ""))
    

            if(categories != ""){

                //for each to create the scores of the categories

                categories.forEach(category => {
    
                    let cardScore = Math.floor(category.score_out_of_10)
        
                    let card = document.createElement("div")
                    let nameP = document.createElement("p")
                    let scoreContainer = document.createElement("div")
                    let scoreP = document.createElement("p")
        
                    nameP.innerHTML = category.name
                    scoreP.innerHTML = cardScore
        
                    card.classList.add("card")
                    nameP.classList.add("name")
                    scoreContainer.classList.add("score-container")
                    scoreP.classList.add("score")
        
                    if(cardScore > 7){
                        scoreContainer.style.backgroundColor = "#40916c"
                    }else if(cardScore <= 7 && cardScore > 4){
                        scoreContainer.style.backgroundColor = "#f9c74f"
                    }else{
                        scoreContainer.style.backgroundColor = "#a4161a"
                    }
        
                    categoriesDiv.appendChild(card)
                    card.appendChild(nameP)
                    card.appendChild(scoreContainer)
                    scoreContainer.appendChild(scoreP)

                });

                // Title for the scores
    
                let scoresTitle = document.createElement("h2")
                    
                scoresTitle.innerHTML = "SCORES OF THIS CITY"
        
                scoresTitle.classList.add("scores-title")
        
                categoriesTitle.appendChild(scoresTitle) 
    
            }else{
                alert("There is some problem with categories's data")
            }


            if(summary != ""){

                // city's description
    
                let summaryTitle = document.createElement("h2")
                let summaryParagraph = document.createElement("p")
        
                summaryTitle.innerHTML = "SUMMARY"
                summaryParagraph.innerHTML = summary
        
                summaryTitle.classList.add("summary-title")
                summaryParagraph.classList.add("summary")
        
                sumAndScore.appendChild(summaryTitle)
                sumAndScore.appendChild(summaryParagraph)

            }else{
                alert("There is some problem with summary's data")
            }

            // city's total score

            if(score != ""){

                let totalScore = document.createElement("p")
    
                totalScore.innerHTML = `CITY'S SCORE: ${score}/100`
        
                totalScore.classList.add("total-score")
        
                sumAndScore.appendChild(totalScore)

            }else{
                alert("There is some problem with score's data")
            }


        })
    }

}
