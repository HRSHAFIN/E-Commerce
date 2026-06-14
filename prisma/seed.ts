import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../src/data';

const prisma = new PrismaClient();

const ROLE_MAP: Record<string, 'ADMIN' | 'MODERATOR' | 'CUSTOMER'> = {
  admin: 'ADMIN',
  moderator: 'MODERATOR',
  customer: 'CUSTOMER',
};

async function main() {
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const defaultPassword = await bcrypt.hash('password123', 10);

  // Seed the curated users from data.ts (admin + customers)
  const seededUsers = [];
  for (const u of INITIAL_USERS) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: defaultPassword,
        fullName: u.fullName,
        role: ROLE_MAP[u.role] ?? 'CUSTOMER',
        isActive: u.isActive,
        joinedDate: new Date(u.joinedDate),
      },
    });
    seededUsers.push(user);
  }

  // Add a dedicated moderator account
  const moderator = await prisma.user.create({
    data: {
      email: 'moderator@auraFashion.com',
      password: defaultPassword,
      fullName: 'Morgan Lee',
      role: 'MODERATOR',
      isActive: true,
      joinedDate: faker.date.past({ years: 1 }),
    },
  });
  seededUsers.push(moderator);

  // Add some random extra customers via faker
  for (let i = 0; i < 12; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: defaultPassword,
        fullName: faker.person.fullName(),
        role: 'CUSTOMER',
        isActive: faker.datatype.boolean({ probability: 0.85 }),
        joinedDate: faker.date.past({ years: 2 }),
      },
    });
    seededUsers.push(user);
  }

  // A couple extra moderators/admins for good measure
  for (let i = 0; i < 2; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: defaultPassword,
        fullName: faker.person.fullName(),
        role: 'MODERATOR',
        isActive: true,
        joinedDate: faker.date.past({ years: 1 }),
      },
    });
  }

  console.log('Seeding products...');
  const productIdMap: Record<string, string> = {};
  for (const p of INITIAL_PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors as object[],
        stock: p.stock,
        isTrending: !!p.isTrending,
        isDealOfDay: !!p.isDealOfDay,
        recentlyViewed: !!p.recentlyViewed,
      },
    });
    productIdMap[p.id] = product.id;
  }

  // A few extra random products
  const extraCategories = ['Men', 'Women', 'Kids', 'Accessories', 'Lifestyle'] as const;
  const extraBrands = ['Aura', 'Cavallo', 'Verdun', 'Ascot & Co', 'Sartorial', 'Junior Aura'];
  const extraProductIds: string[] = [];
  for (let i = 0; i < 6; i++) {
    const price = faker.number.int({ min: 20, max: 400 });
    const discountPercent = faker.number.int({ min: 0, max: 40 });
    const originalPrice = Math.round(price / (1 - discountPercent / 100));
    const product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price,
        originalPrice,
        discountPercent,
        category: faker.helpers.arrayElement(extraCategories),
        brand: faker.helpers.arrayElement(extraBrands),
        rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
        reviewCount: faker.number.int({ min: 0, max: 150 }),
        images: [
          `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/800`,
          `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/800`,
        ],
        sizes: faker.helpers.arrayElements(['S', 'M', 'L', 'XL', 'Standard'], { min: 1, max: 3 }),
        colors: [
          { name: faker.color.human(), hex: faker.color.rgb() },
          { name: faker.color.human(), hex: faker.color.rgb() },
        ],
        stock: faker.number.int({ min: 0, max: 50 }),
        isTrending: faker.datatype.boolean({ probability: 0.3 }),
        isDealOfDay: faker.datatype.boolean({ probability: 0.15 }),
        recentlyViewed: faker.datatype.boolean({ probability: 0.2 }),
      },
    });
    extraProductIds.push(product.id);
  }

  const allProductIds = [...Object.values(productIdMap), ...extraProductIds];

  console.log('Seeding reviews...');
  const customerUsers = seededUsers.filter((u) => u.role === 'CUSTOMER');
  for (const productId of allProductIds) {
    const reviewCount = faker.number.int({ min: 2, max: 5 });
    for (let i = 0; i < reviewCount; i++) {
      const reviewer = faker.helpers.arrayElement(customerUsers);
      await prisma.review.create({
        data: {
          productId,
          userId: reviewer.id,
          author: reviewer.fullName,
          rating: faker.number.int({ min: 3, max: 5 }),
          date: faker.date.past({ years: 1 }),
          comment: faker.lorem.sentences({ min: 1, max: 3 }),
        },
      });
    }
  }

  console.log('Seeding orders...');
  const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
  const paymentMethods = ['Credit Card', 'UPI', 'Cash on Delivery', 'PayPal'];

  // Seed the curated orders from data.ts
  for (const o of INITIAL_ORDERS) {
    const user = seededUsers.find((u) => u.email === o.customerEmail);
    await prisma.order.create({
      data: {
        id: o.id,
        userId: user?.id,
        date: new Date(o.date),
        subtotal: o.subtotal,
        discount: o.discount,
        tax: o.tax,
        deliveryFee: o.deliveryFee,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        customerEmail: o.customerEmail,
        fullName: o.address.fullName,
        phone: o.address.phone,
        addressLine: o.address.addressLine,
        city: o.address.city,
        state: o.address.state,
        zipCode: o.address.zipCode,
        country: o.address.country,
        items: {
          create: o.items.map((item) => ({
            productId: productIdMap[item.product.id],
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColorName: item.selectedColor.name,
            selectedColorHex: item.selectedColor.hex,
            priceAtPurchase: item.product.price,
          })),
        },
      },
    });
  }

  // Random additional orders
  for (let i = 0; i < 10; i++) {
    const customer = faker.helpers.arrayElement(customerUsers);
    const itemCount = faker.number.int({ min: 1, max: 3 });
    const chosenProductIds = faker.helpers.arrayElements(allProductIds, itemCount);

    const products = await prisma.product.findMany({
      where: { id: { in: chosenProductIds } },
    });

    let subtotal = 0;
    const itemsData = products.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const sizes = product.sizes as string[];
      const colors = product.colors as { name: string; hex: string }[];
      subtotal += product.price * quantity;
      return {
        productId: product.id,
        quantity,
        selectedSize: faker.helpers.arrayElement(sizes),
        selectedColorName: faker.helpers.arrayElement(colors).name,
        selectedColorHex: faker.helpers.arrayElement(colors).hex,
        priceAtPurchase: product.price,
      };
    });

    const discount = Number((subtotal * faker.number.float({ min: 0, max: 0.15 })).toFixed(2));
    const tax = Number(((subtotal - discount) * 0.08).toFixed(2));
    const deliveryFee = faker.helpers.arrayElement([0, 0, 5, 15]);
    const total = Number((subtotal - discount + tax + deliveryFee).toFixed(2));
    const status = faker.helpers.arrayElement(statuses);

    await prisma.order.create({
      data: {
        userId: customer.id,
        date: faker.date.past({ years: 1 }),
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
        status,
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        paymentStatus: status === 'Cancelled' ? 'Pending' : 'Paid',
        customerEmail: customer.email,
        fullName: customer.fullName,
        phone: faker.phone.number(),
        addressLine: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        items: { create: itemsData },
      },
    });
  }

  console.log('Seed complete!');
  console.log('---------------------------------');
  console.log('Login credentials (password for all: password123)');
  console.log('Admin:     hasiburshafin@gmail.com');
  console.log('Moderator: moderator@auraFashion.com');
  console.log('Customer:  user@example.com');
  console.log('---------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
