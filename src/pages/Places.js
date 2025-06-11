import { Row, Col, Modal} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { fetchPlaces } from '../apis';
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import PlaceForm from '../containers/PlaceForm';

const Place = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
  :hover {
    transform: scale(1.05);
  }
  > div {
    background-size: cover;
    height: 200px;
    border-radius: 5px;
  }
  > p {
    margin-top: 5px;
    font-size: 20px;
    font-weight: bold;
  }
`;

const AddPlaceButton = styled.div`
    border: 1px dashed gray;
    height: 200px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    background-color: white;
    :hover {
    background-color: #fbfbfb;
    }
`;
const Places = () => {
    const [places, setPlaces] = useState([]);
    const [show, setShow] = useState(false);

    const auth = useContext(AuthContext);
    const history = useHistory();

    const onHide = () => setShow(false);
    const onShow = () => setShow(true);

    const onFetchPlaces = async () => {
      const json = await fetchPlaces(auth.token);
      if (json) {
        setPlaces(json);
      }
    };

    const onDone = () => {  
        onFetchPlaces();
        onHide();
      }

    useEffect(() => {
        onFetchPlaces();
      }, []);

    // Console logs for debugging image URLs
    console.log("[Places.js] REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
    if (places && places.length > 0) {
      places.forEach(place => {
        if (place.image) {
          console.log(`[Places.js] Place: ${place.name}, Original image path: ${place.image}, Constructed URL: ${process.env.REACT_APP_API_URL + place.image}`);
        } else {
          console.log(`[Places.js] Place: ${place.name} has no image path.`);
        }
      });
    } else {
      console.log("[Places.js] No places data to log image URLs for, or places array is empty.");
    }

    return (
    <MainLayout style={{ backgroundColor: 'white' }}>
        <h3>餐厅</h3>
        <Modal show={show} onHide={onHide} centered>
          <Modal.Body>
            <PlaceForm onDone={onDone} place_length={places.length}/>
          </Modal.Body>
        </Modal>

        <Row >
          {places.map((place) => {
            let imageUrl = place.image; // Default to using place.image directly if it's a full URL

            if (place.image && !place.image.startsWith('http')) {
              // If place.image is not a full URL (doesn't start with http), then construct it.
              // This primarily targets relative paths like /media/place_images/image.png
              const apiURL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, ''); // Remove trailing slash from API_URL
              const imagePath = place.image.startsWith('/') ? place.image.substring(1) : place.image; // Remove leading slash if present
              imageUrl = `${apiURL}/${imagePath}`;
            }
            
            // The console.log for the "Constructed URL" in the previous version of the file 
            // was using (process.env.REACT_APP_API_URL + place.image) which might be different 
            // from the imageUrl logic here if place.image was already a full URL.
            // For more accurate debugging of what this map function uses:
            // console.log(`[Places.js] Rendering Place: ${place.name}, Using image URL: ${imageUrl}`);

            return (
              <Col key={place.id} lg={4}>
                <Place onClick={() => history.push(`/places/${place.id}`)}>
                    <div style={{ backgroundImage: `url(${imageUrl})` }}></div>
                    <p>{place.name}</p>
                </Place>
              </Col>
            );
          })}
          <Col lg={4}>
            <AddPlaceButton onClick={onShow}>添加餐厅</AddPlaceButton>
          </Col>
        </Row>

    </MainLayout>
    )
}
export default Places;
