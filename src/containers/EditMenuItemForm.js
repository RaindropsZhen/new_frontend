import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ImageDropzone from './ImageDropzone';
import useEditMenuItemFormLogic from '../hooks/useEditMenuItemFormLogic';

const EditMenuItemForm = ({ place, onDone, item = {} }) => {
  const { t } = useTranslation();
  const {
    itemName,
    setItemName,
    name_to_print,
    set_name_to_print,
    itemDescription,
    setItemDescription,
    price,
    setPrice,
    image,
    setImage,
    isAvailable,
    setIsAvailable,
    orderingTiming,
    handleOrderingTimingChange,
    resetImageDropzone,
    setResetImageDropzone,
    onUpdateMenuItem,
  } = useEditMenuItemFormLogic(item, place, onDone);

  return (
    <div>
      {/* 菜品信息*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>{t('editMenuItemForm.title.changeName')}</p>
        <div style={{ marginLeft: '20px' }}>
          {/* Category ID field was removed in a previous step, so it's not here. If it needs to be re-added, it should be done in a separate task. */}
          <Form.Group>
            <Form.Label>{t('editMenuItemForm.label.chineseName')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('editMenuItemForm.placeholder.enterChineseName')}
              value={itemName.default}
              onChange={(e) => setItemName(prev => ({ ...prev, default: e.target.value }))}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('editMenuItemForm.label.englishName')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('editMenuItemForm.placeholder.enterEnglishName')}
              value={itemName.en}
              onChange={(e) => setItemName(prev => ({ ...prev, en: e.target.value }))}
            />
            </Form.Group>

            {/* Spanish Name field removed */}

            <Form.Group>
              <Form.Label>{t('editMenuItemForm.label.portugueseName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterPortugueseName')}
                value={itemName.pt}
                onChange={(e) => setItemName(prev => ({ ...prev, pt: e.target.value }))}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t('editMenuItemForm.label.printName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterPrintName')}
                value={name_to_print}
                onChange={(e) => set_name_to_print(e.target.value)}
              />
            </Form.Group>
        </div>
      </div>

      {/* 菜品介绍以及价格 */}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>{t('editMenuItemForm.title.changePriceAndDescription')}</p>
        <div style={{ marginLeft: '20px' }}>
          <Form.Group>
            <Form.Label>{t('editMenuItemForm.label.price')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('editMenuItemForm.placeholder.enterPrice')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0" // Prevent negative numbers at browser level
              step="0.01" // Allow decimal prices
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('editMenuItemForm.label.chineseDescription')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('editMenuItemForm.placeholder.enterChineseDescription')}
              value={itemDescription.default}
              onChange={(e) => setItemDescription(prev => ({ ...prev, default: e.target.value }))}
            />
          </Form.Group>
            <Form.Group>
              <Form.Label>{t('editMenuItemForm.label.englishDescription')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterEnglishDescription')}
                value={itemDescription.en}
                onChange={(e) => setItemDescription(prev => ({ ...prev, en: e.target.value }))}
              />
            </Form.Group>
            {/* Spanish Description field removed */}


            <Form.Group>
              <Form.Label>{t('editMenuItemForm.label.portugueseDescription')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editMenuItemForm.placeholder.enterPortugueseDescription')}
                value={itemDescription.pt}
                onChange={(e) => setItemDescription(prev => ({ ...prev, pt: e.target.value }))}
              />
            </Form.Group>

        </div>
      </div>
      <div>
      <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>{t('editMenuItemForm.title.changeOrderingTiming')}</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label={t('editMenuItemForm.label.isAvailable')}
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </Form.Group>
      <p style={{ color: 'gray', fontSize: '14px' }}>{t('editMenuItemForm.label.selectOrderingTiming')}</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label={t('editMenuItemForm.label.allDay')}
          checked={orderingTiming === "lunch_and_dinner"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("lunch_and_dinner")}
        />
        <Form.Check
          type="checkbox"
          label={t('editMenuItemForm.label.lunch')}
          checked={orderingTiming === "lunch"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("lunch")}
        />
        <Form.Check
          type="checkbox"
          label={t('editMenuItemForm.label.dinner')}
          checked={orderingTiming === "dinner"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("dinner")}
        />
      </Form.Group>

    </div>

      {/* 加入图片*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>{t('editMenuItemForm.title.changeImage')}</p>
        <Form.Group>
          {/* <Form.Label>Image</Form.Label> */}
          <ImageDropzone value={image} onChange={setImage} reset={resetImageDropzone} setReset={setResetImageDropzone}/>
        </Form.Group>
      </div>
      
      <Button 
        variant="standard" 
        block 
        onClick={onUpdateMenuItem}
      >
        {t('editMenuItemForm.button.update')}
      </Button>
    </div>

  );
}

export default EditMenuItemForm;
