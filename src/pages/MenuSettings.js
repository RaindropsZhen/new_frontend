import { IoMdArrowBack } from 'react-icons/io';
import { FiEdit2, FiTrash2, FiMenu } from 'react-icons/fi'; // Icons for Edit/Delete, added FiMenu for drag handle
import { Row, Col, Button, Form, Modal, Dropdown } from 'react-bootstrap'; // Added Dropdown
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import {toast} from 'react-toastify';

import { fetchPlace, addCategory, removeCategory, updateCategory, removeMenuItem, reorderCategories } from '../apis'; // Added reorderCategories
import MainLayout from '../layouts/MainLayout';
import MenuItemForm from '../containers/MenuItemForm';
import EditMenuItemForm from '../containers/EditMenuItemForm';

const Panel = styled.div`
  background-color: #ffffff;
  padding: 24px; 
  border-radius: 8px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
  width: 100%;
`;

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px; 
  border-radius: 0; 
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-bottom: 1px solid #dee2e6; 

  &:last-child {
    border-bottom: none; 
  }
  background-color: ${props => props.selected ? '#e9ecef' : 'transparent'}; 
  font-weight: ${props => props.selected ? '600' : 'normal'};

  &:hover {
    background-color: ${props => props.selected ? '#dde2e7' : '#f8f9fa'}; 
  }

  .item-name {
    flex-grow: 1;
    color: #343a40; 
    font-weight: 500; 
    margin-bottom: 4px; 
  }

  .actions {
    flex-shrink: 0;
    margin-left: 15px;
    display: flex;
    align-items: center;
    gap: 10px; 
  }
`;

const ActionButton = styled(Button)`
  padding: 0.3rem 0.5rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: transparent !important; 
  border: 1px solid transparent !important; 
  color: #6c757d; 

  &:hover {
    color: ${props => props.hovercolor || '#007bff'}; 
    background-color: #e9ecef !important; 
  }
`;

const MenuSettings = () => {
  const [place, setPlace] = useState({});
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState(""); 
  const [editCategoryNameEn, setEditCategoryNameEn] = useState(""); 
  const [editCategoryNamePt, setEditCategoryNamePt] = useState(""); 
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState(false);
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // To potentially change style during drag

  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { t, i18n } = useTranslation(); 

  const onBack = () => history.push(`/places/${params.id}`);

  const onFetchPlace = async () => {
    const json = await fetchPlace(params.id);
    if (json) {
      setPlace(json);
    }
  }

  useEffect(() => {
    onFetchPlace();
  }, []);

  const handleShowAddCategoryModal = () => setShowAddCategoryModal(true);
  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setAddCategoryLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error(t('menuSettings.toast.categoryNameEmpty'));
      return;
    }
    setAddCategoryLoading(true);
    try {
      const result = await addCategory({ name: newCategoryName, place: params.id }, auth.token);
      if (result) { 
        toast.success(t('menuSettings.toast.categoryAddedSuccess', { newCategoryName: newCategoryName }));
        onFetchPlace(); 
        handleCloseAddCategoryModal();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setAddCategoryLoading(false);
    }
  };

  const handleShowEditCategoryModal = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name || "");
    setEditCategoryNameEn(category.name_en || "");
    setEditCategoryNamePt(category.name_pt || "");
    setShowEditCategoryModal(true);
  };

  const handleCloseEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setEditingCategory(null);
    setEditCategoryName("");
    setEditCategoryNameEn("");
    setEditCategoryNamePt("");
    setEditCategoryLoading(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      toast.error(t('menuSettings.toast.categoryNameEmpty'));
      return;
    }
    setEditCategoryLoading(true);
    const categoryData = {
      name: editCategoryName,
      name_en: editCategoryNameEn,
      name_pt: editCategoryNamePt,
    };
    try {
      const result = await updateCategory(editingCategory.id, categoryData, auth.token);
      if (result) {
        toast.success(t('menuSettings.toast.categoryUpdatedSuccess', { editCategoryName: editCategoryName }));
        onFetchPlace(); 
        handleCloseEditCategoryModal();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setEditCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    // Use the primary name for confirmation, or a generic term if needed
    const catNameToConfirm = categoryName || t('menuSettings.thisCategory', 'this category');
    if (window.confirm(t('menuSettings.confirm.deleteCategory', { categoryName: catNameToConfirm }))) {
      try {
        const success = await removeCategory(categoryId, auth.token); 
        if (success) {
          toast.success(t('menuSettings.toast.categoryDeletedSuccess', { categoryName: catNameToConfirm }));
          onFetchPlace(); 
          if (selectedCategoryId === categoryId) {
            setSelectedCategoryId(null);
          }
        }
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleShowAddMenuItemModal = () => {
    if (!selectedCategoryId) {
      toast.error(t('menuSettings.toast.selectCategoryFirst'));
      return;
    }
    setShowAddMenuItemModal(true);
  };
  
  const handleCloseAddMenuItemModal = () => {
    setShowAddMenuItemModal(false);
  };

  const handleAddMenuItemSuccess = () => {
    onFetchPlace(); 
    handleCloseAddMenuItemModal();
  };

  const handleShowEditMenuItemModal = (menuItem) => {
    setEditingMenuItem(menuItem);
    setShowEditMenuItemModal(true);
  };

  const handleCloseEditMenuItemModal = () => {
    setShowEditMenuItemModal(false);
    setEditingMenuItem(null);
  };

  const handleEditMenuItemSuccess = () => {
    onFetchPlace(); 
    handleCloseEditMenuItemModal();
  };

  const handleDeleteMenuItem = async (itemId, itemName) => {
    const itemNameToConfirm = itemName || t('menuSettings.thisMenuItem', 'this menu item');
    if (window.confirm(t('menuSettings.confirm.deleteMenuItem', { itemName: itemNameToConfirm }))) {
      try {
        const success = await removeMenuItem(itemId, auth.token);
        if (success) {
          toast.success(t('menuSettings.toast.menuItemDeletedSuccess', { itemName: itemNameToConfirm }));
          onFetchPlace(); 
        }
      } catch (error) {
        console.error("Failed to delete menu item:", error);
      }
    }
  };

  const currentCategory = place.categories?.find(c => c.id === selectedCategoryId);

  const handleOnDragEnd = async (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(place.categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    setPlace(prevPlace => ({
      ...prevPlace,
      categories: items
    }));

    const orderedCategoryIds = items.map(item => item.id);

    try {
      await reorderCategories(params.id, orderedCategoryIds, auth.token);
      toast.success(t('menuSettings.toast.categoriesReorderedSuccess')); // Changed key
      onFetchPlace(); // Re-fetch to ensure consistency, though optimistic update is good
    } catch (error) {
      console.error("Failed to reorder categories:", error);
      toast.error(t('menuSettings.toast.categoriesReorderFailedError')); // Changed key
      // Optionally revert UI update here if API call fails, or rely on re-fetch
      onFetchPlace(); // Re-fetch to revert to server state on error
    }
  };
  
  let displayCategoryNameForTitle = '';
  if (currentCategory) {
    if (i18n.language === 'en' && currentCategory.name_en) {
      displayCategoryNameForTitle = currentCategory.name_en;
    } else if (i18n.language === 'pt' && currentCategory.name_pt) {
      displayCategoryNameForTitle = currentCategory.name_pt;
    } else {
      displayCategoryNameForTitle = currentCategory.name; 
    }
  }

  return (
    <MainLayout>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={onBack} style={{color: '#343a40'}}>
          <IoMdArrowBack size={28} />
        </Button>
        <h2 className="mb-0 ms-2" style={{fontWeight: 600}}>{t('menuSettings.title')}</h2>
        <div style={{ flexGrow: 1 }} /> {/* Spacer div */}
        <div> {/* Wrapper for Dropdown, removed ms-auto */}
          <Dropdown>
            <Dropdown.Toggle 
              variant="outline-secondary" 
              id="dropdown-language" 
              style={{ minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}
            >
              {i18n.language === 'zh' ? <><span role="img" aria-label="China flag">🇨🇳</span> 中文</> : 
               i18n.language === 'en' ? <><span role="img" aria-label="UK flag">🇬🇧</span> EN</> : 
               i18n.language === 'pt' ? <><span role="img" aria-label="Portugal flag">🇵🇹</span> PT</> : 
               i18n.language.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: '150px' }}>
              <Dropdown.Item active={i18n.language === 'zh'} onClick={() => i18n.changeLanguage('zh')} style={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="China flag" style={{ marginRight: '8px' }}>🇨🇳</span> 中文
              </Dropdown.Item>
              <Dropdown.Item active={i18n.language === 'en'} onClick={() => i18n.changeLanguage('en')} style={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="UK flag" style={{ marginRight: '8px' }}>🇬🇧</span> English (EN)
              </Dropdown.Item>
              <Dropdown.Item active={i18n.language === 'pt'} onClick={() => i18n.changeLanguage('pt')} style={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="Portugal flag" style={{ marginRight: '8px' }}>🇵🇹</span> Português (PT)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Panel>
            <h5 style={{ marginBottom: '20px', fontWeight: 600 }}>{t('menuSettings.categoriesTitle')}</h5>
            <DragDropContext 
              onDragStart={() => setIsDragging(true)} 
              onDragEnd={handleOnDragEnd}
            >
              <Droppable droppableId="categories">
                {(provided) => (
                  <ul 
                    className="list-unstyled mb-0" 
                    style={{ borderTop: '1px solid #dee2e6' }}
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                  >
                    {place.categories && place.categories.length > 0 ? (
                      place.categories.map((category, index) => {
                        let catDisplayLangName = category.name;
                        if (i18n.language === 'en' && category.name_en) {
                          catDisplayLangName = category.name_en;
                        } else if (i18n.language === 'pt' && category.name_pt) {
                          catDisplayLangName = category.name_pt;
                        }
                        return (
                          <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                            {(provided, snapshot) => (
                              <StyledListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                selected={selectedCategoryId === category.id}
                                onClick={() => setSelectedCategoryId(category.id)}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? '#d0eaff' : (selectedCategoryId === category.id ? '#e9ecef' : 'transparent'),
                                }}
                              >
                                <div {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                  <FiMenu size={18} />
                                </div>
                                <span className="item-name">
                                  {catDisplayLangName}
                                </span>
                                <div className="actions">
                                  <ActionButton
                                    variant="light"
                                    size="sm"
                                    hovercolor="#007bff"
                                    onClick={(e) => { e.stopPropagation(); handleShowEditCategoryModal(category); }}
                                    title={t('common.edit')}
                                  >
                                    <FiEdit2 size={18} />
                                  </ActionButton>
                                  <ActionButton
                                    variant="light"
                                    size="sm"
                                    hovercolor="#dc3545"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id, catDisplayLangName); }}
                                    title={t('common.delete')}
                                  >
                                    <FiTrash2 size={18} />
                                  </ActionButton>
                                </div>
                              </StyledListItem>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      !isDragging && <p className="text-center text-muted mt-3">{t('menuSettings.noCategoriesYet')}</p>
                    )}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <Button variant="success" block className="mt-3 w-100" onClick={handleShowAddCategoryModal}>
              {t('menuSettings.addCategory')}
            </Button>
          </Panel>
        </Col>

        <Col md={8}>
          {selectedCategoryId && currentCategory ? (
            <Panel>
              <h5 style={{marginBottom: '20px', fontWeight: 600}}>{t('menuSettings.menuItemsForCategory', { categoryName: displayCategoryNameForTitle || '' })}</h5>
              {currentCategory.menu_items?.length > 0 ? (
                <ul className="list-unstyled mb-0" style={{ borderTop: '1px solid #dee2e6' }}>
                  {currentCategory.menu_items.map(item => {
                    let imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || '').replace(/\/$/, '')}/${item.image.startsWith('/') ? item.image.substring(1) : item.image}`) : null;
                    
                    let itemDisplayLangName = item.name;
                    if (i18n.language === 'en' && item.name_en) itemDisplayLangName = item.name_en;
                    else if (i18n.language === 'pt' && item.name_pt) itemDisplayLangName = item.name_pt;

                    let itemDisplayLangDesc = item.description;
                    if (i18n.language === 'en' && item.description_en) itemDisplayLangDesc = item.description_en;
                    else if (i18n.language === 'pt' && item.description_pt) itemDisplayLangDesc = item.description_pt;
                    const descriptionPreview = itemDisplayLangDesc && itemDisplayLangDesc.length > 70 ? `${itemDisplayLangDesc.substring(0, 70)}...` : itemDisplayLangDesc;

                    return (
                    <StyledListItem key={item.id}> 
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt={itemDisplayLangName} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover', 
                            marginRight: '15px', 
                            borderRadius: '4px',
                            flexShrink: 0
                          }} 
                        />
                      )}
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className="item-name">{itemDisplayLangName} - ${item.price}</span> 
                        {descriptionPreview && (
                          <small className="text-muted d-block" style={{ fontSize: '0.85em', lineHeight: '1.3', marginTop: '4px' }}>
                            {descriptionPreview}
                          </small>
                        )}
                      </div>
                      <div className="actions">
                        <ActionButton 
                          variant="light" 
                          size="sm" 
                          hovercolor="#007bff"
                          onClick={() => handleShowEditMenuItemModal(item)}
                          title={t('common.edit')}
                        >
                          <FiEdit2 size={18} />
                        </ActionButton>
                        <ActionButton 
                          variant="light" 
                          size="sm" 
                          hovercolor="#dc3545"
                          onClick={() => handleDeleteMenuItem(item.id, itemDisplayLangName)}
                          title={t('common.delete')}
                        >
                          <FiTrash2 size={18} />
                        </ActionButton>
                      </div>
                    </StyledListItem>
                  ); 
                  })}
                </ul>
              ) : (
                <p className="text-center text-muted mt-3">{t('menuSettings.noMenuItemsYet')}</p>
              )}
              <Button variant="success" block className="mt-3 w-100" onClick={handleShowAddMenuItemModal}>{t('menuSettings.addMenuItem')}</Button>
            </Panel>
          ) : (
            <Panel>
              <p className="text-center text-muted">{t('menuSettings.selectCategoryPrompt')}</p>
            </Panel>
          )}
        </Col>
      </Row>

      <Modal show={showAddCategoryModal} onHide={handleCloseAddCategoryModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('menuSettings.modal.addNewCategoryTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('menuSettings.modal.categoryNameLabel')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('menuSettings.modal.enterCategoryNamePlaceholder')}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddCategoryModal}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleAddCategory} disabled={addCategoryLoading}>
            {addCategoryLoading ? t('common.adding') : t('menuSettings.modal.saveCategoryButton')}
          </Button>
        </Modal.Footer>
      </Modal>

      {editingCategory && (
        <Modal show={showEditCategoryModal} onHide={handleCloseEditCategoryModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('menuSettings.modal.editCategoryTitle', { categoryName: editingCategory.name })}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('menuSettings.modal.categoryNameLabel')} (中文)</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('menuSettings.modal.enterNewCategoryNamePlaceholder')}
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('menuSettings.modal.englishNameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterEnglishName')}
                value={editCategoryNameEn}
                onChange={(e) => setEditCategoryNameEn(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('menuSettings.modal.portugueseNameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterPortugueseName')}
                value={editCategoryNamePt}
                onChange={(e) => setEditCategoryNamePt(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditCategoryModal}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleUpdateCategory} disabled={editCategoryLoading}>
              {editCategoryLoading ? t('common.saving') : t('common.saveChanges')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {selectedCategoryId && place && (
        <Modal show={showAddMenuItemModal} onHide={handleCloseAddMenuItemModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('menuSettings.modal.addMenuItemTitle', { categoryName: displayCategoryNameForTitle || '' })}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MenuItemForm
              place={place}
              item={{ category: selectedCategoryId }} 
              onDone={handleAddMenuItemSuccess}
            />
          </Modal.Body>
        </Modal>
      )}

      {editingMenuItem && place && (
        <Modal show={showEditMenuItemModal} onHide={handleCloseEditMenuItemModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('menuSettings.modal.editMenuItemTitle', { itemName: editingMenuItem.name })}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditMenuItemForm
              item={editingMenuItem}
              place={place} 
              onDone={handleEditMenuItemSuccess}
            />
          </Modal.Body>
        </Modal>
      )}
    </MainLayout>
  )
}

export default MenuSettings;
