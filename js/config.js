// Data produk dengan path gambar yang sesuai
const products = [
    { 
        id: 1, 
        name: "Bruschetta Classica", 
        price: 35000, 
        bestSeller: true, 
        category: "appetizer",
        description: "Roti panggang dengan tomat segar, basil, dan minyak zaitun",
        image: "img/Bruschetta Classica.jpg"
    },
    { 
        id: 2, 
        name: "Spaghetti Carbonara", 
        price: 65000, 
        bestSeller: true, 
        category: "main-course",
        description: "Pasta dengan saus krim, telur, keju parmesan, dan pancetta",
        image: "img/Spaghetti Carbonara.jpg"
    },
    { 
        id: 3, 
        name: "Risotto ai Funghi", 
        price: 75000, 
        bestSeller: false, 
        category: "main-course",
        description: "Nasi Italia dengan jamur porcini dan parmesan",
        image: "img/Risotto ai Funghi.jpg"
    },
    { 
        id: 4, 
        name: "Pizza Margherita", 
        price: 80000, 
        bestSeller: true, 
        category: "main-course",
        description: "Pizza dengan tomat, mozzarella, dan daun basil segar",
        image: "img/Pizza Margherita.jpg"
    },
    { 
        id: 5, 
        name: "Tiramisu Classico", 
        price: 45000, 
        bestSeller: true, 
        category: "dessert",
        description: "Dessert Italia dengan mascarpone, kopi, dan coklat",
        image: "img/Tiramisu Classico.jpg"
    },
    { 
        id: 6, 
        name: "Insalata Caprese", 
        price: 55000, 
        bestSeller: false, 
        category: "appetizer",
        description: "Salad dengan tomat, mozzarella, basil, dan minyak zaitun",
        image: "img/Insalata Caprese.jpg"
    },
    { 
        id: 7, 
        name: "Osso Buco", 
        price: 120000, 
        bestSeller: false, 
        category: "main-course",
        description: "Veal shank dengan sayuran dan anggur putih, disajikan dengan risotto",
        image: "img/Osso Buco(1).png"
    },
    { 
        id: 8, 
        name: "Panna Cotta", 
        price: 35000, 
        bestSeller: false, 
        category: "dessert",
        description: "Dessert krim vanilla dengan saus berry",
        image: "img/Panna Cotta(1).png"
    },
    { 
        id: 9, 
        name: "Antipasto della Casa", 
        price: 95000, 
        bestSeller: true, 
        category: "appetizer",
        description: "Piring pembuka dengan berbagai daming, keju, dan zaitun",
        image: "img/Antipasto della Casa.png"
    },
    { 
        id: 10, 
        name: "Gelato Artigianale", 
        price: 30000, 
        bestSeller: false, 
        category: "dessert",
        description: "Es krim Italia buatan tangan dengan berbagai pilihan rasa",
        image: "img/Gelato Artigianale.jpg"
    },
    {
        id: 11,
        name: "Beef Wellington",
        price: 235000,
        bestSeller: true,
        category: "main-course",
        description: "Daging sapi tenderloin dibalut puff pastry renyah dengan saus merah anggur.",
        image: "img/Beef Wellington.jpg"
    },
    {
        id: 12,
        name: "Ramen Wagyu",
        price: 165000,
        bestSeller: true,
        category: "main-course",
        description: "Ramen dengan kaldu gurih dan potongan wagyu premium.",
        image: "img/Ramen Wagyu.jpg"
    },
    {
        id: 13,
        name: "Truffle Mushroom Risotto",
        price: 145000,
        bestSeller: true,
        category: "main-course",
        description: "Risotto creamy dengan aroma truffle oil khas Italia.",
        image: "img/Truffle Mushroom Risotto.jpg"
    },
    {
        id: 14,
        name: "Pad Thai Signature",
        price: 125000,
        bestSeller: true,
        category: "main-course",
        description: "Mi beras goreng khas Thailand dengan udang dan saus tamarind.",
        image: "img/Pad Thai Signature.jpg"
    },
    {
        id: 15,
        name: "Bruschetta al Pomodoro",
        price: 65000,
        bestSeller: false,
        category: "appetizer",
        description: "Roti baguette panggang dengan tomat, basil, dan minyak zaitun.",
        image: "img/Bruschetta al Pomodoro.jpg"
    },
    {
        id: 16,
        name: "Gyoza Chicken",
        price: 58000,
        bestSeller: false,
        category: "appetizer",
        description: "Pangsit Jepang isi ayam dan sayuran, disajikan dengan saus shoyu jahe.",
        image: "img/Gyoza Chicken.jpg"
    },
    {
        id: 17,
        name: "Smoked Salmon Canapés",
        price: 72000,
        bestSeller: false,
        category: "appetizer",
        description: "Salmon asap di atas roti kecil dengan krim keju dan lemon zest.",
        image: "img/Smoked Salmon Canapés.jpg"
    },
    {
        id: 18,
        name: "Spring Roll Vietnam",
        price: 55000,
        bestSeller: false,
        category: "appetizer",
        description: "Gulungan segar isi sayuran, udang, dan bihun, dengan saus kacang.",
        image: "img/Spring Roll Vietnam.jpg"
    },
    {
        id: 19,
        name: "Coq au Vin",
        price: 175000,
        bestSeller: false,
        category: "main-course",
        description: "Ayam dimasak perlahan dengan anggur merah dan jamur gaya Prancis.",
        image: "img/Coq au Vin.jpg"
    },
    {
        id: 20,
        name: "Nasi Goreng Seafood",
        price: 95000,
        bestSeller: false,
        category: "main-course",
        description: "Nasi goreng dengan udang, cumi, dan ikan segar khas Asia.",
        image: "img/Nasi Goreng Seafood.jpg"
    },
    {
        id: 21,
        name: "Spaghetti Carbonara",
        price: 115000,
        bestSeller: false,
        category: "main-course",
        description: "Pasta lembut dengan saus krim telur, parmesan, dan smoked beef.",
        image: "img/Spaghetti Carbonara.jpg"
    },
    {
        id: 22,
        name: "Chicken Teriyaki",
        price: 105000,
        bestSeller: false,
        category: "main-course",
        description: "Ayam panggang dengan saus teriyaki manis gurih khas Jepang.",
        image: "img/Chicken Teriyaki.jpg"
    },
    {
        id: 23,
        name: "Crème Brûlée",
        price: 68000,
        bestSeller: false,
        category: "dessert",
        description: "Custard lembut dengan lapisan gula karamel panggang.",
        image: "img/Creme Brulee.jpg"
    },
    {
        id: 24,
        name: "Matcha Lava Cake",
        price: 78000,
        bestSeller: false,
        category: "dessert",
        description: "Kue lembut dengan lelehan matcha di dalamnya, disajikan hangat dengan es krim vanila.",
        image: "img/Matcha Lava Cake.jpg"
    },
    {
        id: 25,
        name: "Strawberry Cheesecake Stuffed Donuts",
        price: 65000,
        bestSeller: false,
        category: "dessert",
        description: "Donat dengan cream cheese dan potongan buah strawberry segar.",
        image: "img/Strawberry Cheesecake Stuffed Donuts.jpg"
    },
    {
        id: 26,
        name: "Mango Sticky Rice",
        price: 58000,
        bestSeller: false,
        category: "dessert",
        description: "Ketan manis dengan potongan mangga matang dan saus santan.",
        image: "img/Mango Sticky Rice.jpg"
    },
    {
        id: 27,
        name: "Lychee Sparkle Tea",
        price: 45000,
        bestSeller: false,
        category: "beverage",
        description: "Teh hijau dingin dengan sirup leci dan soda segar.",
        image: "img/Lychee Sparkle Tea.png"
    },
    {
        id: 28,
        name: "Rosemary Lemonade",
        price: 42000,
        bestSeller: false,
        category: "beverage",
        description: "Lemon segar dengan madu dan aroma rosemary.",
        image: "img/Rosemary Lemonade.png"
    },
    {
        id: 29,
        name: "Iced Matcha Latte",
        price: 48000,
        bestSeller: false,
        category: "beverage",
        description: "Matcha Jepang premium dengan susu segar dan es batu.",
        image: "img/Iced Matcha Latte.png"
    },
    {
        id: 30,
        name: "Affogato Espresso",
        price: 55000,
        bestSeller: false,
        category: "beverage",
        description: "Espresso panas disiramkan di atas es krim vanila.",
        image: "img/Affogato Espresso.png"
    }
];

// Data promo yang aktif
const activePromos = [
    {
        id: 1,
        name: "Weekend Special",
        description: "Diskon 30% untuk semua menu pasta setiap akhir pekan",
        discountType: "percentage",
        discountValue: 30,
        applicableCategories: ["main-course"],
        minOrder: 0,
        code: "WEEKEND30",
        isActive: true,
        validUntil: "2025-12-31"
    },
    {
        id: 2,
        name: "Birthday Special",
        description: "Gratis 1 dessert untuk setiap pembelian minimal Rp 200.000",
        discountType: "free_item",
        discountValue: 1,
        applicableCategories: ["dessert"],
        minOrder: 200000,
        code: "HBD2025",
        isActive: true,
        validUntil: "2025-12-31"
    },
    {
        id: 3,
        name: "Appetizer Combo",
        description: "Beli 2 appetizer gratis 1 appetizer",
        discountType: "buy_x_get_y",
        discountValue: 1,
        applicableCategories: ["appetizer"],
        minOrder: 2,
        code: "APPETIZERCOMBO",
        isActive: true,
        validUntil: "2025-11-30"
    },
    {
        id: 4,
        name: "Cashback Special",
        description: "Cashback Rp 25.000 untuk pembelian minimal Rp 150.000",
        discountType: "fixed_amount",
        discountValue: 25000,
        applicableCategories: ["all"],
        minOrder: 150000,
        code: "CASHBACK25",
        isActive: true,
        validUntil: "2025-10-31"
    }
];

// Data pesanan
let orders = [];
let currentFilter = "all";
let appliedPromo = null;
let currentSortField = 'name';
let currentSortDirection = 'asc';