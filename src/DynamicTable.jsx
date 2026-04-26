import { useMemo } from "react";
import { Table, Tag } from "antd";

const STATUS_COLORS = {
  "在庫あり": "green", "残り少ない": "orange", "在庫なし": "red",
  "契約中": "green", "休止中": "red", "交渉中": "blue",
};

const renderValue = (key, value) => {
  if (key === "status") return <Tag color={STATUS_COLORS[value] || "default"}>{value}</Tag>;
  if (key === "price") return `¥${value?.toLocaleString()}`;
  return value;
};

export default function DynamicTable({ items, showFilter = false }) {
  const columns = useMemo(() => {
    if (items.length === 0) return [];
    return Object.keys(items[0]).map(key => ({
      title: key,
      dataIndex: key,
      key: key,
      sorter: (a, b) => {
        const aVal = a[key], bVal = b[key];
        return typeof aVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal), "ja");
      },
      ...(showFilter && {
        filters: [...new Set(items.map(r => String(r[key])))].map(v => ({ text: v, value: v })),
        onFilter: (value, record) => String(record[key]) === String(value),
      }),
      render: (text, _, key2) => renderValue(key, text),
    }));
  }, [items, showFilter]);

  return (
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#767676" }}>
        全{items.length}件
      </div>
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
      <div style={{ marginTop: 8, fontSize: 11, color: "#767676", display: "flex", gap: 16 }}>
        {showFilter && <span>列ヘッダーの ▽ でフィルター</span>}
        <span>列ヘッダーでソート</span>
      </div>
    </div>
  );
}