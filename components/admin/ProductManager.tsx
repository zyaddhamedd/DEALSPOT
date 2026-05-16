"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { ProductList } from "@/components/admin/ProductList";
import { Product } from "@/lib/types";

const STORAGE_WARNING_THRESHOLD = 4.5 * 1024 * 1024;

const findProductById = (products: Product[], productId: string) =>
  products.find((product) => product.id === productId);

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [toast, setToast] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setSavedProducts(data);
      if (data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load products from database.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedProduct = useMemo(
    () => findProductById(products, selectedProductId) ?? products[0],
    [products, selectedProductId],
  );

  const savedSelectedProduct = useMemo(
    () => findProductById(savedProducts, selectedProductId),
    [savedProducts, selectedProductId],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedProduct || !savedSelectedProduct) {
      return false;
    }

    return JSON.stringify(selectedProduct) !== JSON.stringify(savedSelectedProduct);
  }, [savedSelectedProduct, selectedProduct]);

  // Storage warning no longer applies for DB/Cloudinary, but we keep the memo for UI compatibility if needed
  const storageWarning = "";

  const updateProduct = (productId: string, updater: (product: Product) => Product) => {
    setProducts((current) =>
      current.map((product) => (product.id === productId ? updater(product) : product)),
    );
    setToast("");
  };

  const updateSelectedProduct = <Key extends keyof Product>(key: Key, value: Product[Key]) => {
    if (!selectedProduct) {
      return;
    }

    updateProduct(selectedProduct.id, (product) => ({
      ...product,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    try {
      const isNew = !savedSelectedProduct;
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${selectedProduct.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Save failed");
      }

      await fetchProducts();
      setToast("تم حفظ تعديلات المنتج في قاعدة البيانات بنجاح.");
    } catch (err) {
      setToast(`⚠️ فشل الحفظ! ${err instanceof Error ? err.message : "خطأ غير معروف"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCurrent = () => {
    if (!selectedProduct) {
      return;
    }

    const fallback = findProductById(savedProducts, selectedProduct.id);
    if (!fallback) {
      return;
    }

    updateProduct(selectedProduct.id, () => fallback);
    setToast("تمت إعادة المنتج الحالي إلى آخر نسخة محفوظة.");
  };

  const handleAddProduct = () => {
    const tempId = `new-${Date.now()}`;
    const newProduct: Product = {
      id: tempId,
      name: "New Product",
      slug: `new-product-${Date.now()}`,
      description: "Enter product description here...",
      price: 0,
      salePrice: 0,
      images: [],
      sizes: ["37", "38", "39", "40", "41"],
      active: true,
      featured: false,
      reviews: [],
      faq: []
    };

    setProducts((current) => [newProduct, ...current]);
    setSelectedProductId(tempId);
    setToast("منتج جديد جاهز للتعديل. اضغط 'Save Changes' لإضافته لقاعدة البيانات.");
  };

  const handleDeleteProduct = async (productId: string) => {
    const productToDelete = findProductById(products, productId);
    if (!productToDelete) return;

    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${productToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // If it's a temp product not yet saved to DB
      if (productId.startsWith("new-")) {
        const updatedProducts = products.filter((p) => p.id !== productId);
        setProducts(updatedProducts);
        setSavedProducts(savedProducts.filter(p => p.id !== productId));
        if (selectedProductId === productId) {
          setSelectedProductId(updatedProducts[0]?.id ?? "");
        }
        return;
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchProducts();
      setToast(`تم حذف المنتج "${productToDelete.name}" بنجاح.`);
    } catch (err) {
      setToast("⚠️ فشل الحذف من قاعدة البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAll = () => {
    setToast("⚠️ ميزة إعادة التعيين الكاملة تم إيقافها للأمان في نسخة الإنتاج.");
  };

  if (error) {
    return (
      <div className="panel p-10 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={() => void fetchProducts()} className="btn-primary mt-4">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Product Control</p>
            <h1 className="headline mt-4 text-3xl text-white sm:text-4xl">Manage Products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              واجهة إدارة سريعة للمنتجات. اختار موديل من القائمة لتعديل بياناته أو صوره مباشرة.
            </p>
          </div>
          {isLoading && (
            <div className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm font-bold text-white/80 animate-pulse">
              Syncing...
            </div>
          )}
        </div>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ProductList
          products={products}
          selectedProductId={selectedProduct?.id ?? ""}
          onSelect={setSelectedProductId}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
        />
        <ProductEditor
          product={selectedProduct}
          hasUnsavedChanges={hasUnsavedChanges}
          storageWarning={storageWarning}
          onChange={updateSelectedProduct}
          onImagesChange={(images) => updateSelectedProduct("images", images)}
          onSave={handleSave}
          onResetCurrent={handleResetCurrent}
          onResetAll={handleResetAll}
        />
      </div>
    </div>
  );
}
