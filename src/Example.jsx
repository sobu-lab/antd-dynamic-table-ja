import { ConfigProvider } from "antd";
import jaJP from "antd/locale/ja_JP";
import DynamicTable from "./DynamicTable";

const STOCK_DATA = [
  { id: 1, name: "トマト",       category: "野菜", quantity: 150, price: 120,  status: "在庫あり" },
  { id: 2, name: "キャベツ",     category: "野菜", quantity: 80,  price: 200,  status: "在庫あり" },
  { id: 3, name: "鶏もも肉",     category: "肉",   quantity: 30,  price: 450,  status: "残り少ない" },
  { id: 4, name: "牛ロース",     category: "肉",   quantity: 0,   price: 1200, status: "在庫なし" },
];

export default function Example() {
  const handleSave = (changedRows) => {
    console.log("保存:", changedRows);
    // await fetch("/api/items", { method: "PUT", body: JSON.stringify(changedRows) })
  };

  return (
    <ConfigProvider locale={jaJP} theme={{ token: { colorPrimary: "#0017C1" } }}>
      <div style={{ padding: 32 }}>

        <h2>編集・フィルターあり</h2>
        <DynamicTable
          items={STOCK_DATA}
          onSave={handleSave}
          showFilter={true}
          editable={true}
        />

        <h2>表示のみ</h2>
        <DynamicTable
          items={STOCK_DATA}
          showFilter={false}
          editable={false}
        />

      </div>
    </ConfigProvider>
  );
}