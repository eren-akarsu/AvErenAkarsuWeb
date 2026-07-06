import React, { useState } from 'react';
import { Search, Eye, Edit3, Trash2, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomCheckbox } from '../ui/CustomCheckbox';

interface ListItem {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  status: string;
  viewCount?: number;
  likeCount?: number;
}

interface ContentListTableProps {
  items: ListItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkStatusChange?: (ids: string[], newStatus: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  isEn?: boolean;
}

export const ContentListTable: React.FC<ContentListTableProps> = ({
  items,
  onEdit,
  onDelete,
  onBulkStatusChange,
  onBulkDelete,
  isEn = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const executeBulkPublish = () => {
    if (selectedIds.length === 0) return;
    if (onBulkStatusChange) onBulkStatusChange(selectedIds, 'Yayında');
    setSelectedIds([]);
  };

  const executeBulkDraft = () => {
    if (selectedIds.length === 0) return;
    if (onBulkStatusChange) onBulkStatusChange(selectedIds, 'Taslak');
    setSelectedIds([]);
  };

  const executeBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = isEn ? `Are you sure you want to delete these ${selectedIds.length} items?` : `Seçili ${selectedIds.length} öğeyi silmek istediğinize emin misiniz?`;
    if (confirm(confirmMsg)) {
      if (onBulkDelete) onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filtering Toolbar */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(12, 16, 30, 0.45)',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(240, 218, 197, 0.08)'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, maxWidth: '500px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              placeholder={isEn ? "Search content title..." : "İçerik başlığı ara..."}
              style={{ width: '100%', paddingLeft: '36px', height: '38px', fontSize: '13px' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
          </div>

          {/* Status filter */}
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'ALL', label: isEn ? 'All Status' : 'Tüm Durumlar' },
              { value: 'Yayında', label: isEn ? 'Published' : 'Yayında' },
              { value: 'Taslak', label: isEn ? 'Draft' : 'Taslak' },
              { value: 'Planlandı', label: isEn ? 'Scheduled' : 'Planlandı' }
            ]}
            style={{ width: '130px' }}
          />
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#A0AEC0', marginRight: '6px' }}>
              {isEn ? `${selectedIds.length} selected` : `${selectedIds.length} seçildi`}
            </span>
            <button onClick={executeBulkPublish} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', height: '30px' }}>
              {isEn ? 'Publish' : 'Yayınla'}
            </button>
            <button onClick={executeBulkDraft} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', height: '30px' }}>
              {isEn ? 'Draft' : 'Taslağa Al'}
            </button>
            <button onClick={executeBulkDelete} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', height: '30px', background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' }}>
              {isEn ? 'Delete' : 'Sil'}
            </button>
          </div>
        )}
      </div>

      {/* Grid List view */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#0C101E', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
          <AlertCircle size={28} style={{ color: '#718096', marginBottom: '10px' }} />
          <p style={{ color: '#A0AEC0', fontSize: '13px' }}>{isEn ? 'No content items match your query.' : 'Aramanızla eşleşen içerik bulunamadı.'}</p>
        </div>
      ) : (
        <div className="table-responsive-container">
          <table 
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              textAlign: 'left',
              fontSize: '13px'
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.15)', color: '#A0AEC0' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}>
                  <CustomCheckbox 
                    checked={selectedIds.length === filteredItems.length && filteredItems.length > 0} 
                    onChange={handleSelectAll} 
                  />
                </th>
                <th style={{ padding: '12px 16px' }}>{isEn ? 'Title' : 'Başlık'}</th>
                <th style={{ padding: '12px 16px' }}>{isEn ? 'Category' : 'Kategori'}</th>
                <th style={{ padding: '12px 16px' }}>{isEn ? 'Published Date' : 'Yayın Tarihi'}</th>
                <th style={{ padding: '12px 16px' }}>{isEn ? 'Status' : 'Durum'}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>{isEn ? 'Actions' : 'İşlemler'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr 
                    key={item.id}
                    className="table-row-hover"
                    style={{ 
                      borderBottom: '1px solid rgba(240, 218, 197, 0.06)',
                      background: isSelected ? 'rgba(80, 34, 60, 0.08)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <CustomCheckbox 
                        checked={isSelected} 
                        onChange={(checked: boolean) => handleSelectRow(item.id, checked)} 
                      />
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#F0DAC5' }}>
                      {item.title}
                    </td>
                    <td style={{ padding: '16px', color: '#A0AEC0' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '16px', color: '#718096' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} />
                        {item.publishedAt}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span 
                        style={{ 
                          fontSize: '10px', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          fontWeight: 500,
                          background: item.status === 'Yayında' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(113, 128, 150, 0.15)', 
                          color: item.status === 'Yayında' ? '#10B981' : '#A0AEC0' 
                        }}
                      >
                        {item.status === 'Yayında' ? (isEn ? 'Published' : 'Yayında') : (isEn ? 'Draft' : 'Taslak')}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          onClick={() => onEdit(item.id)} 
                          className="table-action-btn"
                          title={isEn ? 'Edit' : 'Düzenle'}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(isEn ? 'Are you sure you want to delete this content item?' : 'Bu içeriği silmek istediğinize emin misiniz?')) {
                              onDelete(item.id);
                            }
                          }} 
                          className="table-action-btn text-danger"
                          title={isEn ? 'Delete' : 'Sil'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Responsive Styles for Table to Card Conversions */}
      <style>{`
        .table-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid rgba(240, 218, 197, 0.15);
          background: rgba(12, 16, 30, 0.4);
          color: #A0AEC0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .table-action-btn:hover {
          color: #F0DAC5;
          border-color: #50223C;
          background: rgba(80, 34, 60, 0.2);
        }
        .table-action-btn.text-danger:hover {
          color: #EF4444;
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .table-row-hover:hover {
          background: rgba(240, 218, 197, 0.02) !important;
        }

        @media (max-width: 768px) {
          .table-responsive-container table,
          .table-responsive-container thead,
          .table-responsive-container tbody,
          .table-responsive-container th,
          .table-responsive-container td,
          .table-responsive-container tr {
            display: block;
          }
          .table-responsive-container thead {
            display: none; /* Hide headings on mobile */
          }
          .table-responsive-container tr {
            background: rgba(12, 16, 30, 0.45) !important;
            border: 1px solid rgba(240, 218, 197, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
          }
          .table-responsive-container td {
            border: none;
            padding: 6px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed rgba(240, 218, 197, 0.05);
          }
          .table-responsive-container td:last-child {
            border: none;
            margin-top: 10px;
          }
          .table-responsive-container td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #718096;
            font-size: 11px;
            text-transform: uppercase;
          }
        }
      `}</style>

    </div>
  );
};
export default ContentListTable;
