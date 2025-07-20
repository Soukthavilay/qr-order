"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { Language, Translation } from "../types"

const translations: Translation = {
  // Navigation
  menu: { en: "Menu", lo: "ເມນູ", th: "เมนู", vi: "Thực đơn" },
  dashboard: { en: "Dashboard", lo: "ແດັດບອດ", th: "แดชบอร์ด", vi: "Bảng điều khiển" },
  integrations: { en: "Integrations", lo: "ການເຊື່ອມຕໍ່", th: "การเชื่อมต่อ", vi: "Tích hợp" },
  inventory: { en: "Inventory", lo: "ສິນຄ້າ", th: "สินค้าคงคลัง", vi: "Kho hàng" },
  reservations: { en: "Reservations", lo: "ການຈອງ", th: "การจอง", vi: "Đặt bàn" },
  reviews: { en: "Reviews", lo: "ການທົບທວນ", th: "รีวิว", vi: "Đánh giá" },
  tracking: { en: "Order Tracking", lo: "ຕິດຕາມຄໍາສັ່ງ", th: "ติดตามคำสั่ง", vi: "Theo dõi đơn hàng" },
  pos: { en: "POS", lo: "ຈຸດຂາຍ", th: "จุดขาย", vi: "Điểm bán hàng" },

  // Menu
  ourMenu: { en: "Our Menu", lo: "ເມນູຂອງພວກເຮົາ", th: "เมนูของเรา", vi: "Thực đơn của chúng tôi" },
  table: { en: "Table", lo: "ໂຕະ", th: "โต๊ะ", vi: "Bàn" },
  cart: { en: "Cart", lo: "ກະຕ່າ", th: "ตะกร้า", vi: "Giỏ hàng" },
  add: { en: "Add", lo: "ເພີ່ມ", th: "เพิ่ม", vi: "Thêm" },
  added: { en: "Added", lo: "ເພີ່ມແລ້ວ", th: "เพิ่มแล้ว", vi: "Đã thêm" },
  placeOrder: { en: "Place Order", lo: "ສັ່ງອາຫານ", th: "สั่งอาหาร", vi: "Đặt hàng" },

  // Status
  available: { en: "Available", lo: "ມີຢູ່", th: "มีอยู่", vi: "Có sẵn" },
  limited: { en: "Limited", lo: "ຈໍາກັດ", th: "จำกัด", vi: "Hạn chế" },
  outOfStock: { en: "Out of Stock", lo: "ໝົດສິນຄ້າ", th: "หมดสต็อก", vi: "Hết hàng" },
  popular: { en: "Popular", lo: "ນິຍົມ", th: "ยอดนิยม", vi: "Phổ biến" },

  // Order Status
  pending: { en: "Pending", lo: "ລໍຖ້າ", th: "รอดำเนินการ", vi: "Đang chờ" },
  preparing: { en: "Preparing", lo: "ກໍາລັງກະກຽມ", th: "กำลังเตรียม", vi: "Đang chuẩn bị" },
  ready: { en: "Ready", lo: "ພ້ອມແລ້ວ", th: "พร้อมแล้ว", vi: "Sẵn sàng" },
  served: { en: "Served", lo: "ໄດ້ຮັບໃຊ້", th: "เสิร์ฟแล้ว", vi: "Đã phục vụ" },

  // Common
  search: { en: "Search", lo: "ຄົ້ນຫາ", th: "ค้นหา", vi: "Tìm kiếm" },
  filters: { en: "Filters", lo: "ຕົວກອງ", th: "ตัวกรอง", vi: "Bộ lọc" },
  clearAll: { en: "Clear all", lo: "ລຶບທັງໝົດ", th: "ล้างทั้งหมด", vi: "Xóa tất cả" },
  save: { en: "Save", lo: "ບັນທຶກ", th: "บันทึก", vi: "Lưu" },
  cancel: { en: "Cancel", lo: "ຍົກເລີກ", th: "ยกเลิก", vi: "Hủy" },
  confirm: { en: "Confirm", lo: "ຢືນຢັນ", th: "ยืนยัน", vi: "Xác nhận" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("restaurant-language") as Language
    if (savedLanguage && ["en", "lo", "th", "vi"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("restaurant-language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
