import React from "react";
import styled from "styled-components"
import Axios from 'axios'
import {ImSearch} from 'react-icons/im'
import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import YTSearch from "youtube-api-search"

//credentials for text format
const APP_ID = "a52b4d43";
const APP_KEY = "e0e5c667605f5e91d8275c973531b80a";

//credential for video
const key = "AIzaSyA8Ay2MAlcHv4E3lQBeKwy2hvGhzG0ViV4";

//styling
const Heading = styled.h2``;
const Blockquote = styled.p`
  color: #808080;
  font-size: 14px;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 3rem;
`;
const Input = styled.input`
  padding: 0.4rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  outline: 0;
  width: 30%;
  border: 1px solid #d65108;
  color: #d65108;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  ::placeholder {
    color: #d65108;
  }
`;
const Button = styled.button`
  background-color: #d65108;
  border: none;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  cursor: pointer;
`;
const SearchIcon = styled.div`
  color: #fff;
  padding: 3px 4px 0 0;
`;
const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  justify-content: space-evenly;
`;
const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  border-radius: 0.5rem;
  box-shadow: 0 3px 10px 0 #aaa;
  margin-bottom: 2.5rem;
`;
const FoodImage = styled.img`
  height: 280px;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem; 
  object-fit: cover;
`;
const FoodName = styled.span`
  font-size: 18px;
  color: black;
  font-weight: bold;
  margin: 12px 0;
`;
const Ingredient = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  // width: 50%;
  padding: 0.3rem 2rem;
  border-radius: 5rem;
  background-color: #d65108;
  cursor: pointer;
  margin: 5px 20px;
`;
const Video = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  // width: 50%;
  padding: 0.3rem 2rem;
  border-radius: 5rem;
  background-color: #d65108;
  cursor: pointer;
  margin: 5px 20px 22px;
`;
const PlaceHolder = styled.img`
  margin-top: -50px;
  opacity: 40%;
`;
const P = styled.p`
  color: #d65108;
  margin: 0;
`;

//each post
const Recipe = (props) => {
    const [show,setShow] = React.useState(false);
    const [video,setVideo] = useState();
    const {recipeObj} = props;

    const videoSearch = async () => {
      YTSearch({key: key, term: recipeObj.label+" recipe"}, (videos) => {
      setVideo(videos[0]);
      console.log(video.id.videoId);
      return window.open(`https://www.youtube.com/embed/${video.id.videoId}`);
      // return window.open(`https://www.youtube.com/watch?v=${video.id.videoId}
      })
    }

    return (
        <>
          <Dialog open={show}>
            <DialogTitle><P>Ingredients</P></DialogTitle>
            <DialogContent>
              <table>
                <thead>
                  <th>Ingredients</th>
                  <th>Weight</th>
                </thead>
                <tbody>
                  {recipeObj.ingredients.map((ingredient) => (
                    <tr>
                      <td>{ingredient.text}</td>
                      <td>{ingredient.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DialogContent>
            <DialogActions>
              <Video onClick={() => window.open(recipeObj.url)}>See More</Video>
              <Video onClick={() => setShow("")}>Close</Video>
            </DialogActions>
          </Dialog>
            <RecipeContainer>
                <FoodImage src={recipeObj.image} alt="food" />
                <FoodName>{recipeObj.label}</FoodName>
                <Ingredient onClick={()=>setShow(true)}>Ingredients</Ingredient>
                <Video onClick={videoSearch}>Watch Video</Video>
            </RecipeContainer>
        </>
    );
}

//whole app
function RecipeComponent() {
  // const [timeoutId,updateTimeOutId] = useState();
  const [recipeList,updateRecipeList] = useState([]);

  const fetchRecipe = async (searchString) => {
    const response = await Axios.get(`https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`,);
    updateRecipeList(response.data.hits);
  }
  //another way for searching without search button
  // const onTextChange = (event) => {
  //   clearTimeout(timeoutId);
  //   const timeout = setTimeout(fetchRecipe(event.target.value),1000);
  //   updateTimeOutId(timeout);
  // }

  const [inputValue, setInputValue] = useState('');
  const onChange = async () => {
    console.log(inputValue);
    await fetchRecipe(inputValue);
  }


  return (
      <>
          <Heading>Find Recipe For Your Meal</Heading>
          <Blockquote>Real food doesn't have ingredients, real food is ingredients.<br />- <em>Jamie Oliver</em></Blockquote>

          <SearchBox>
          {/* <Input type="text" placeholder="Enter an ingredient" onChange={onTextChange}/>
          <Button type="submit" onClick={onChange}>
              <SearchIcon><ImSearch /></SearchIcon>
          </Button> */}

            <Input type="text" placeholder="Enter an ingredient" onChange={(e) => setInputValue(e.target.value)}/>
            <Button type="submit" onClick={onChange}><SearchIcon><ImSearch /></SearchIcon></Button>
          </SearchBox>
          
          <Heading>Your Search Results:</Heading>

          <RecipeListContainer>
            {recipeList.length ?
              recipeList.map((recipeObj) => (
              <Recipe recipeObj={recipeObj.recipe} />
            )): 
            <PlaceHolder src="https://www.creativefabrica.com/wp-content/uploads/2020/02/11/Food-Logo-Graphics-1-71-580x386.jpg" alt="logo"/>
            }
          </RecipeListContainer>
      </>
  );
}

export default RecipeComponent