import { FaUtensils, FaShoppingCart, FaHistory } from "react-icons/fa";
import { BottomTabContainer, TabItem, TabIcon, Badge } from "./BottomTabBar.styles.js";

const TabNavigationBar = ({ activeTab, onSelectTab, totalQuantity }) => {
  return (
    <BottomTabContainer>
      <TabItem active={activeTab === "menu"} onClick={() => onSelectTab("menu")}>
        <TabIcon>
          <FaUtensils />
        </TabIcon>
        Menu
      </TabItem>
      <TabItem active={activeTab === "cart"} onClick={() => onSelectTab("cart")}>
        <TabIcon>
          <FaShoppingCart />
          {totalQuantity > 0 && <Badge>{totalQuantity}</Badge>}
        </TabIcon>
        Cart
      </TabItem>
      <TabItem active={activeTab === "history"} onClick={() => onSelectTab("history")}>
        <TabIcon>
          <FaHistory />
        </TabIcon>
        History
      </TabItem>
    </BottomTabContainer>
  );
};

export default TabNavigationBar;
