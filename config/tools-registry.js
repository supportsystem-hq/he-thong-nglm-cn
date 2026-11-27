// ============================================================================
// DANH SÁCH CÔNG CỤ NGHIỆP VỤ (CHỈ CẦN THÊM MỚI TẠI ĐÂY KHI CÓ FILE HTML MỚI)
// ============================================================================
// Hướng dẫn thêm công cụ mới sau này:
// Bước 1: Chép file .html mới của bạn vào thư mục "tools/" (VD: tools/bao-gia.html)
// Bước 2: Copy 1 khối { ... } bên dưới, dán thêm vào cuối danh sách và sửa lại thông tin:
//         - id: mã không dấu, viết liền (VD: "bao-gia")
//         - name: Tên hiển thị trên thẻ công cụ & bảng phân quyền
//         - description: Mô tả ngắn chức năng
//         - icon: Biểu tượng emoji (VD: "💰", "📦", "🧾", "📋")
//         - path: Đường dẫn tới file trong thư mục tools (VD: "./tools/bao-gia.html")
//         - tag: Nhãn bộ phận (VD: "Kinh doanh", "Kho vận", "Kế toán")

window.WORKSPACE_TOOLS = [
  {
    id: "in-tem-phu",
    name: "In Tem Phụ Hóa Chất (GHS)",
    description: "Tạo & in tem phụ chuẩn GHS 100×70mm / A4, tự gắn đúng logo công ty, cắt hình đồ từ PDF MSDS.",
    icon: "🏷️",
    path: "./tools/in-tem-phu.html",
    tag: "Kho & Sản xuất"
  },
  {
    id: "xuat-bao-cao",
    name: "Báo Cáo & Đối Soát Hóa Chất KSĐB",
    description: "Đối soát chéo Sổ bán hàng – Sổ vật tư, phân bổ FIFO theo GPNK và xuất Excel A4 ngang.",
    icon: "📊",
    path: "./tools/xuat-bao-cao.html",
    tag: "Pháp lý & Sở Công Thương"
  }

  // --- VÍ DỤ KHI BẠN THÊM CÔNG CỤ THỨ 3 (Bỏ dấu // ở đầu các dòng dưới để kích hoạt) ---
  //   ,{
    id: "doi-chieu-msds",
    name: "Đối chiếu MSDS",
    description: "Đối chiếu thành phần Mục 3, xuất Excel và lập báo cáo khách hàng.",
    icon: "📋",
    path: "./tools/doi_chieu_msds_V11.html",
    tag: "Pháp lý & Sở Công Thương"
  }
];
