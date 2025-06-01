import styled from "styled-components";

export const BottomTabContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f8f9fa; /* Light gray background */
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 0 0; /* Increased border-radius */
  padding: 2px 0; /* Further reduced padding */
  display: flex;
  justify-content: space-around;
`;

export const TabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 5px 0;
  font-size: 10px; /* Further reduced font-size */
  color: ${({ active }) => (active ? "#FE6C4C" : "#666")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  transition: color 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    color: #FE6C4C;
  }
`;

export const TabIcon = styled.div`
  font-size: 18px;
  margin-bottom: 2px;
  position: relative; /* Added for positioning the badge */
`;

export const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 5px;
  font-size: 12px;
`;
