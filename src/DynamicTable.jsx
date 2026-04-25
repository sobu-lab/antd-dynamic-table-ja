import { useState, useMemo } from "react";
import { Table, Button, Tag } from "antd";

const STATUS_COLORS = {
  "在庫あり": "green", "残り少ない": "orange", "在庫なし": "red",
  "契約中": "green", "休止中": "red", "交渉中": "blue",
};

const renderValue = (key, value) => {
  if (key === "status") return <Tag color={STATUS_COLORS[value] || "default"}>{value}</Tag>;
  if (key === "price") return `¥${value?.toLocaleString()}`;
  return value;
};

export default function DynamicTable({
  items,
  onSave,
  showFilter = false,
  editable = true,
}) {
  const [rows, setRows] = useState(items);
  const [editedRows, setEditedRows] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  const renderCell = (record, key, value) => {
    if (!editable) return renderValue(key, value);
    const isEditing = editingCell?.rowId === record.id && editingCell?.field === key;
    if (isEditing) {
      return (
        <input
          autoFocus
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={() => commitEdit(record, key)}
          onKeyDown={e => {
            if (e.key === "Enter") commitEdit(record, key);
            if (e.key === "Escape") setEditingCell(null);
          }}
          style={{ width: "100%", border: "1px solid #0017C1", borderRadius: 4, padding: "2px 6px", outline: "none" }}
        />
      );
    }
    return (
      <span
        onDoubleClick={() => { setEditingCell({ rowId: record.id, field: key }); setEditValue(String(record[key])); }}
        style={{ cursor: editable ? "cell" : "default", display: "block", minHeight: 22 }}
      >
        {renderValue(key, value)}
      </span>
    );
  };

  const commitEdit = (record, key) => {
    if (!editingCell) return;
    const newValue = !isNaN(editValue) && editValue !== "" ? Number(editValue) : editValue;
    const updated = { ...record, [key]: newValue };
    setRows(prev => prev.map(r => r.id === record.id ? updated : r));
    setEditedRows(prev => ({ ...prev, [record.id]: updated }));
    setEditingCell(null);
  };

  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).map(key => ({
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
      render: (text, record) => renderCell(record, key, text),
    }));
  }, [rows, showFilter, editable, editingCell, editValue]);

  const handleSave = () => {
    onSave?.(Object.values(editedRows));
    setEditedRows({});
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const changedCount = Object.keys(editedRows).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "#767676" }}>
          全{rows.length}件
          {changedCount > 0 && <span style={{ color: "#faad14", marginLeft: 8 }}>● {changedCount}件変更中</span>}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {savedMessage && <span style={{ color: "#52c41a", fontSize: 13 }}>✓ 保存しました</span>}
          {editable && changedCount > 0 && (
            <>
              <Button type="primary" size="small" onClick={handleSave}>保存（{changedCount}件）</Button>
              <Button size="small" onClick={() => { setRows(items); setEditedRows({}); }}>取消</Button>
            </>
          )}
        </div>
      </div>
      <Table
        dataSource={rows}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: "max-content" }}
        rowClassName={record => editedRows[record.id] ? "edited-row" : ""}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
      <style>{`.edited-row td { background: #EEF1FF !important; }`}</style>
      <div style={{ marginTop: 8, fontSize: 11, color: "#767676", display: "flex", gap: 16 }}>
        {editable && <span>ダブルクリックで編集</span>}
        {showFilter && <span>列ヘッダーの ▽ でフィルター</span>}
        <span>列ヘッダーでソート</span>
      </div>
    </div>
  );
}