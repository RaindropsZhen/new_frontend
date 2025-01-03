import { IoMdArrowBack } from 'react-icons/io';
import { AiOutlineDelete, AiOutlineQrcode } from 'react-icons/ai';
import { RiFileList3Line } from 'react-icons/ri';
// import { FiSettings } from 'react-icons/fi';
import { Row, Col, Button, Modal, Dropdown  } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { HiMiniLanguage } from 'react-icons/hi2';
import { RiEBike2Fill } from "react-icons/ri";
// import { VscGraph } from "react-icons/vsc";
import { TiPrinter } from "react-icons/ti";
import PrintersModal from '../components/Printers';
import { FaRegEdit } from "react-icons/fa";
import EditPlace from '../components/EditPlace';

import { 
  fetchPlace, 
  removePlace, 
  removeCategory, 
  removeMenuItem, 
  updatePlace,
  // deleteImage
} from '../apis';

import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import MenuItemForm from '../containers/MenuItemForm';
import MenuItem from '../components/MenuItem';
import QRCodeModal from '../components/QRCodeModal';
import QRCodeModalTakeAway from '../components/QRCodeModalTakeAway';
import EditMenuItemForm from '../containers/EditMenuItemForm';


const Panel = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 10px rgba(0,0,0,0.05);
`;


const languages = [
  {
    code: "name",
    name: "中文",
    country_code: "china"
  },
  {
    code: "en",
    name: "English",
    country_code: "us"
  },
  {
    code: "pt",
    name: "Português",
    country_code: "pt"
  }
]

const Place = () => {
  const [place, setPlace] = useState({});
  const [menuItemFormShow, setMenuItemFormShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrCode, setQrCode] = useState(false);
  const [qrCodeTakeAway, setqrCodeTakeAway] = useState(false);
  const [EditPlaceFormShow, SetEditPlaceFormShow] = useState(false);

  const showModal = () => setMenuItemFormShow(true);
  const hideModal = () => setMenuItemFormShow(false);

  const showQRModal = () => setQrCode(true);
  const hideQRModal = () => setQrCode(false);

  const showEditPlace = () => SetEditPlaceFormShow(true);
  const hideEditPlace = () => SetEditPlaceFormShow(false);
  
  const [printersModalShow, setprintersModalShow] = useState(false);
  const showprinterModal = () => setprintersModalShow(true);
  const hideprinterModal = () => setprintersModalShow(false);
  
  const showqrCodeTakeAway = () => setqrCodeTakeAway(true);
  const hideqrCodeTakeAway = () => setqrCodeTakeAway(false);

  // 语言过滤器
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].name)

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const renderCategoryName = (category) => {
    switch (selectedLanguage) {
      case '中文':
        return category.name_cn;
      case 'English':
        return category.name_en;
      case 'Português':
        return category.name_pt;
      default:
        return category.name; // Fallback to the default language (Chinese in this example)
    }
  };
  
  const auth = useContext(AuthContext);
  const params = useParams();
  const history = useHistory();

  const onBack = () => history.push("/places");

  const onFetchPlace = async () => {
    const json = await fetchPlace(params.id, auth.token);
    if (json) {
      setPlace(json);
    }
  };

  const onRemovePlace = () => {
    const c = window.confirm("确定要删除餐厅吗？将会丢失所有菜单信息，请确认清楚！");
    // deleteImage({"public_id":place.image});

    if (c) {
      removePlace(params.id, auth.token).then(onBack);
    }
  };

  const onRemoveCategory = (id) => {
    const c = window.confirm("确定要删除菜品分类吗？");
    if (c) {
      removeCategory(id, auth.token).then(onFetchPlace);
    }
  };

  const onRemoveMenuItem = (id) => {
    const c = window.confirm("确定要删除菜品吗？");
    if (c) {
      removeMenuItem(id, auth.token).then(onFetchPlace);
    }
  };

  const onUpdatePlace = (tables) => {
    updatePlace(place.id, { number_of_tables: tables }, auth.token).then(
      (json) => {
        if (json) {
          setPlace(json);
        }
      }
    )
  }

  useEffect(() => {
    onFetchPlace();
  }, []);

  return (
    <MainLayout>
      <Row>
        <Col lg={12}>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button variant="link" onClick={onBack}>
                <IoMdArrowBack size={25} color="black" />
              </Button>
              <h3 className="mb-0 ml-2 mr-2">{place.name}</h3>
              <div>

                <Button variant="link" onClick={showEditPlace}>
                  <FaRegEdit  size={25} color="blue" />
                  <span style={{ font:'15px' }}>
                    编辑餐厅信息
                  </span>
                </Button>

                <Button variant="link" onClick={onRemovePlace}>
                  <AiOutlineDelete size={25} color="red" />
                  <span style={{ font:'15px',color:'red' }}>
                    删除餐厅
                  </span>
                </Button>
              </div>
            </div>

            <Button variant="link" href={`/places/${params.id}/qrcode`} target="_blank" rel="noopener noreferrer">
              <AiOutlineQrcode size={25} />
            </Button>


            <Button variant="link" onClick={showqrCodeTakeAway} >
              <RiEBike2Fill size={25} />
            </Button>

            <Button variant="link" href={`/places/${params.id}/orders`} target="_blank" rel="noopener noreferrer">
              <RiFileList3Line size={25} />
            </Button>

            <Button variant="link" onClick={showprinterModal}>
              <TiPrinter size={25} />
            </Button>
          </div>
        </Col>

        <Col md={4}>

          <Panel>
            <MenuItemForm place={place} onDone={onFetchPlace} />
          </Panel>
        </Col>

        <Col md={8} class="p-2">
          <Dropdown>
              <Dropdown.Toggle variant="standard" id="dropdown-basic">
                <HiMiniLanguage /> {selectedLanguage}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {languages.map((language) => (
                  <Dropdown.Item
                    href="#"
                    key={language.name}
                    onClick={() => handleLanguageSelect(language.name)}
                  >
                    {language.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {place?.categories?.map((category) => (
              <div key={category.id} className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <h4 className="mb-0 mr-2">
                    <b>{renderCategoryName(category)}</b>
                  </h4>
                  <Button variant="link" onClick={() => onRemoveCategory(category.id)}>
                    <AiOutlineDelete size={25} color="red" />
                  </Button>
                </div>
                {category.menu_items.map((item) => (
                  <MenuItem 
                    language = {selectedLanguage}
                    key={item.id} 
                    item={item} 
                    onEdit={() => {
                      setSelectedItem(item);
                      showModal();
                    }}
                    onRemove={() => onRemoveMenuItem(item.id)}
                  />
                ))}
              </div>
            ))}
        </Col>
      </Row>
    
      <Modal show={menuItemFormShow} onHide={hideModal} centered>
        <Modal.Body>
          <h4 className="text-center">菜品信息</h4>
          <EditMenuItemForm 
            place={place}
            is_editing
            onDone={() => {
              onFetchPlace();
              hideModal();
            }}
            item={selectedItem}
          />
        </Modal.Body>
      </Modal>



      <QRCodeModalTakeAway 
        show={qrCodeTakeAway} 
        onHide={hideqrCodeTakeAway} 
        place={place} 
        centered 
        onUpdatePlace={onUpdatePlace}
      />

      <PrintersModal
        show={printersModalShow}
        onHide={hideprinterModal}
        place={place}
      />

      <Modal 
        show={EditPlaceFormShow} 
        onHide={hideEditPlace} 
        centered
      >
        <Modal.Body>
          <EditPlace place={place}/>
        </Modal.Body>
      </Modal>


    </MainLayout>
  )
};

export default Place;