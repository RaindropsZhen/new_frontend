import { FaUtensils, FaShoppingCart, FaHistory } from "react-icons/fa";
import { BottomTabContainer, TabItem, TabIcon, Badge } from "./BottomTabBar.styles.js";

const tabTexts = {
  menu: { English: "Menu", '中文': "菜单", Português: "Menu" },
  cart: { English: "Cart", '中文': "购物车", Português: "Carrinho" },
  history: { English: "History", '中文': "历史", Português: "Histórico" },
};

const TabNavigationBar = ({ activeTab, onSelectTab, totalQuantity, selectedLanguage }) => {
  const getTabText = (tabKey) => {
    return tabTexts[tabKey][selectedLanguage] || tabTexts[tabKey]['English']; // Fallback to English
  };

  return (
    <BottomTabContainer>
      <TabItem active={activeTab === "menu"} onClick={() => onSelectTab("menu")}>
        <TabIcon>
          <FaUtensils />
        </TabIcon>
        {getTabText("menu")}
      </TabItem>
      <TabItem active={activeTab === "cart"} onClick={() => onSelectTab("cart")}>
        <TabIcon>
          <FaShoppingCart />
          {totalQuantity > 0 && <Badge>{totalQuantity}</Badge>}
        </TabIcon>
        {getTabText("cart")}
      </TabItem>
      <TabItem active={activeTab === "history"} onClick={() => onSelectTab("history")}>
        <TabIcon>
          <FaHistory />
        </TabIcon>
        {getTabText("history")}
      </TabItem>
    </BottomTabContainer>
  );
};

export default TabNavigationBar;
