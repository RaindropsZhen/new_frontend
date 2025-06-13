import { FaUtensils, FaShoppingCart, FaHistory } from "react-icons/fa";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { BottomTabContainer, TabItem, TabIcon, Badge } from "./BottomTabBar.styles.js";

const TabNavigationBar = ({ activeTab, onSelectTab, totalQuantity }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <BottomTabContainer>
      <TabItem active={activeTab === "menu"} onClick={() => onSelectTab("menu")}>
        <TabIcon>
          <FaUtensils />
        </TabIcon>
        {t('tabs.menu')}
      </TabItem>
      <TabItem active={activeTab === "cart"} onClick={() => onSelectTab("cart")}>
        <TabIcon>
          <FaShoppingCart />
          {totalQuantity > 0 && <Badge>{totalQuantity}</Badge>}
        </TabIcon>
        {t('tabs.cart')}
      </TabItem>
      <TabItem active={activeTab === "history"} onClick={() => onSelectTab("history")}>
        <TabIcon>
          <FaHistory />
        </TabIcon>
        {t('tabs.history')}
      </TabItem>
    </BottomTabContainer>
  );
};

export default TabNavigationBar;
