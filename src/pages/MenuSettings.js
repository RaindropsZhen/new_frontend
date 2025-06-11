import { IoMdArrowBack } from 'react-icons/io';
import { FiEdit2, FiTrash2 } from 'react-icons/fi'; // Icons for Edit/Delete
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import {toast} from 'react-toastify';

import { fetchPlace, addCategory, removeCategory, updateCategory, addMenuItems, removeMenuItem, updateMenuItem } from '../apis';
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
  padding: 12px 12px; // Slightly increased vertical padding
  border-radius: 0; // Remove individual border-radius if using full-width lines
  // margin-bottom: 8px; // Remove margin if using borders for separation
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-bottom: 1px solid #dee2e6; // Add bottom border

  &:last-child {
    border-bottom: none; // No border for the last item
  }
  background-color: ${props => props.selected ? '#e9ecef' : 'transparent'}; 
  font-weight: ${props => props.selected ? '600' : 'normal'};

  &:hover {
    background-color: ${props => props.selected ? '#dde2e7' : '#f8f9fa'}; 
  }

  .item-name {
    flex-grow: 1;
    color: #343a40; // Darker text for better readability
    font-weight: 500; // Added from inline style
    margin-bottom: 4px; // Added from inline style
  }

  .actions {
    flex-shrink: 0;
    margin-left: 15px;
    display: flex;
    align-items: center;
    gap: 10px; // Increased gap for better touch targets
  }
`;

const ActionButton = styled(Button)`
  padding: 0.3rem 0.5rem; // Slightly more padding
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: transparent !important; // Override default bootstrap background
  border: 1px solid transparent !important; // Override default bootstrap border
  color: #6c757d; // Muted icon color

  &:hover {
    color: ${props => props.hovercolor || '#007bff'}; // Default hover blue, allow custom
    background-color: #e9ecef !important; // Light background on hover
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
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState(false);
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

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
    setEditCategoryName(category.name);
    setShowEditCategoryModal(true);
  };

  const handleCloseEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setEditingCategory(null);
    setEditCategoryName("");
    setEditCategoryLoading(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      toast.error(t('menuSettings.toast.categoryNameEmpty'));
      return;
    }
    setEditCategoryLoading(true);
    try {
      const result = await updateCategory(editingCategory.id, { name: editCategoryName }, auth.token);
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
    if (window.confirm(t('menuSettings.confirm.deleteCategory', { categoryName: categoryName }))) {
      try {
        const success = await removeCategory(categoryId, auth.token); 
        if (success) {
          toast.success(t('menuSettings.toast.categoryDeletedSuccess', { categoryName: categoryName }));
          onFetchPlace(); 
          if (selectedCategoryId === categoryId) { // If deleted category was selected, unselect it
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
    if (window.confirm(t('menuSettings.confirm.deleteMenuItem', { itemName: itemName }))) {
      try {
        const success = await removeMenuItem(itemId, auth.token);
        if (success) {
          toast.success(t('menuSettings.toast.menuItemDeletedSuccess', { itemName: itemName }));
          onFetchPlace(); 
        }
      } catch (error) {
        console.error("Failed to delete menu item:", error);
      }
    }
  };

  const currentCategory = place.categories?.find(c => c.id === selectedCategoryId);

  return (
    <MainLayout>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={onBack} style={{color: '#343a40'}}>
          <IoMdArrowBack size={28} />
        </Button>
        <h2 className="mb-0 ms-2" style={{fontWeight: 600}}>{t('menuSettings.title')}</h2>
      </div>

      <Row>
        <Col md={4}>
          <Panel> 
            <h5 style={{marginBottom: '20px', fontWeight: 600}}>{t('menuSettings.categoriesTitle')}</h5>
            {place.categories && place.categories.length > 0 ? (
              <ul className="list-unstyled mb-0" style={{ borderTop: '1px solid #dee2e6' }}> {/* Add border-top to ul to complement item borders */}
                {place.categories.map((category) => (
                  <StyledListItem 
                    key={category.id} 
                    selected={selectedCategoryId === category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <span className="item-name">
                      {category.name}
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
                        onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id, category.name); }}
                        title={t('common.delete')}
                      >
                        <FiTrash2 size={18} />
                      </ActionButton>
                    </div>
                  </StyledListItem>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted mt-3">{t('menuSettings.noCategoriesYet')}</p> 
            )}
            <Button variant="success" block className="mt-3 w-100" onClick={handleShowAddCategoryModal}> 
              {t('menuSettings.addCategory')}
            </Button>
          </Panel>
        </Col>

        <Col md={8}>
          {selectedCategoryId && currentCategory ? (
            <Panel>
              <h5 style={{marginBottom: '20px', fontWeight: 600}}>{t('menuSettings.menuItemsForCategory', { categoryName: currentCategory.name || '' })}</h5>
              {currentCategory.menu_items?.length > 0 ? (
                <ul className="list-unstyled mb-0" style={{ borderTop: '1px solid #dee2e6' }}> {/* Add border-top to ul */}
                  {currentCategory.menu_items.map(item => {
                    let imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || '').replace(/\/$/, '')}/${item.image.startsWith('/') ? item.image.substring(1) : item.image}`) : null;
                    const descriptionPreview = item.description && item.description.length > 70 ? `${item.description.substring(0, 70)}...` : item.description;

                    // Note: The StyledListItem for menu items does not need onClick or selected prop directly,
                    // and hover effects are defined in its styled-component definition.
                    // The error might be a linter/parser false positive or a very subtle syntax issue.
                    // For now, ensuring the structure is clean.
                    return (
                    <StyledListItem key={item.id}> 
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt={item.name} 
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
                        <span className="item-name">{item.name} - ${item.price}</span> 
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
                          onClick={() => handleDeleteMenuItem(item.id, item.name)}
                          title={t('common.delete')}
                        >
                          <FiTrash2 size={18} />
                        </ActionButton>
                      </div>
                    </StyledListItem>
                  ); // Explicitly ensuring semicolon for the return statement
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
            <Form.Group>
              <Form.Label>{t('menuSettings.modal.newCategoryNameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('menuSettings.modal.enterNewCategoryNamePlaceholder')}
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
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
            <Modal.Title>{t('menuSettings.modal.addMenuItemTitle', { categoryName: currentCategory?.name || '' })}</Modal.Title>
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
