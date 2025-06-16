import { useParams } from "react-router-dom"; // useHistory removed
import React, { useEffect, useState, useContext, useCallback } from "react"; // Added useCallback
import { Container } from "react-bootstrap";
import QRCode from "../components/QRCode";
import styled from "styled-components";

import {
  fetchPlace,
  // deleteImage
} from "../apis";

import AuthContext from "../contexts/AuthContext";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); /* Responsive columns */
  gap: 16px; /* Space between grid items */
  padding: 20px;
`;

const QRCodePage = () => {
  const [place, setPlace] = useState({});
  const auth = useContext(AuthContext);
  const params = useParams();
  // const history = useHistory(); // history removed
  const onFetchPlace = useCallback(async () => {
    const json = await fetchPlace(params.id, auth.token);
    if (json) {
      setPlace(json);
    }
  }, [params.id, auth.token]); // Added dependencies to useCallback

  useEffect(() => {
    onFetchPlace();
  }, [onFetchPlace]); // Added onFetchPlace to dependencies

  return (
    <Container fluid style={{ padding: 20 }}>
      <h2 className="text-center">
        点餐二维码, 总桌号 <b>{place.number_of_tables}</b>
      </h2>
      <GridContainer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <QRCode placeId={place.id} />
      </GridContainer>
    </Container>
  );
};

export default QRCodePage;
