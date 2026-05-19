const Service = require('../models/Service');

const services = [
  {
    slug: 'sua-chua-nha',
    title: 'Sửa chữa nhà',
    description:
      'Dịch vụ sửa chữa toàn diện cho mọi loại công trình, từ sửa nhỏ đến nâng cấp toàn bộ. Đội ngũ kỹ thuật lành nghề đảm bảo chất lượng.',
    detail:
      'Quân Bảo khảo sát hiện trạng, tư vấn giải pháp phù hợp ngân sách và triển khai sửa chữa gọn gàng, hạn chế ảnh hưởng sinh hoạt trong quá trình thi công.',
    features: [
      'Sửa chữa ẩm mốc, thấm dột',
      'Lắp đặt điện nước mới',
      'Sơn phủ, hoàn thiện',
      'Nâng cấp hệ thống',
      'Bảo trì định kỳ',
    ],
    includes: [
      'Khảo sát hiện trạng và tư vấn phương án xử lý',
      'Báo giá vật tư, nhân công theo từng hạng mục',
      'Thi công chống thấm, điện nước, trần, tường, sàn',
      'Vệ sinh, nghiệm thu và bàn giao sau sửa chữa',
    ],
    process: [
      'Tiếp nhận nhu cầu và đặt lịch khảo sát',
      'Đánh giá hiện trạng, thống nhất phương án',
      'Thi công theo tiến độ đã cam kết',
      'Nghiệm thu, bàn giao và bảo hành hạng mục',
    ],
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'xay-nha-tron-goi',
    title: 'Xây nhà trọn gói',
    description:
      'Từ thiết kế đến hoàn thiện, chúng tôi lo trọn gói. Nhà phố, biệt thự, nhà xưởng - tất cả đều được thực hiện chuyên nghiệp.',
    detail:
      'Gói xây nhà trọn gói giúp chủ đầu tư kiểm soát chi phí, tiến độ và chất lượng từ bản vẽ đến bàn giao công trình hoàn thiện.',
    features: [
      'Thiết kế bản vẽ chi tiết',
      'Vật tư xây dựng chất lượng',
      'Thi công bởi đội ngũ chuyên nghiệp',
      'Nghiệm thu đầy đủ',
      'Bảo hành sau bàn giao',
    ],
    includes: [
      'Tư vấn thiết kế kiến trúc, kết cấu và công năng',
      'Lập dự toán chi tiết theo chủng loại vật tư',
      'Thi công phần thô, hoàn thiện và lắp đặt cơ bản',
      'Quản lý tiến độ, chất lượng và hồ sơ nghiệm thu',
    ],
    process: [
      'Trao đổi nhu cầu, ngân sách và phong cách',
      'Hoàn thiện bản vẽ, dự toán và hợp đồng',
      'Tổ chức thi công, giám sát từng giai đoạn',
      'Nghiệm thu tổng thể và bàn giao công trình',
    ],
    image:
      'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'thiet-ke-thi-cong',
    title: 'Thiết kế và thi công',
    description:
      'Kiến trúc sư chuyên nghiệp tư vấn và thiết kế công trình đẹp mắt, hiện đại, hợp phong thủy đáp ứng mọi yêu cầu.',
    detail:
      'Dịch vụ kết hợp thiết kế và thi công giúp ý tưởng trên bản vẽ được triển khai đồng bộ, giảm sai lệch giữa thẩm mỹ, kỹ thuật và ngân sách.',
    features: [
      'Tư vấn thiết kế miễn phí',
      'Bản vẽ 3D minh họa',
      'Thiết kế hợp phong thủy',
      'Kiểm soát ngân sách',
      'Hỗ trợ thủ tục pháp lý',
    ],
    includes: [
      'Khảo sát nhu cầu sử dụng và phong cách mong muốn',
      'Thiết kế mặt bằng, phối cảnh và hồ sơ kỹ thuật',
      'Tư vấn vật liệu, màu sắc và giải pháp hoàn thiện',
      'Thi công theo hồ sơ thiết kế đã thống nhất',
    ],
    process: [
      'Tư vấn ý tưởng và thu thập yêu cầu',
      'Phát triển phương án thiết kế sơ bộ',
      'Hoàn thiện hồ sơ kỹ thuật và dự toán',
      'Thi công, giám sát tác giả và nghiệm thu',
    ],
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'phan-tho',
    title: 'Phần thô',
    description:
      'Xây dựng phần thô với tiêu chuẩn kỹ thuật cao, vật liệu đảm bảo, tiến độ rõ ràng cho công trình của bạn.',
    detail:
      'Thi công phần thô tập trung vào nền móng, kết cấu và hệ thống kỹ thuật âm tường, tạo nền tảng bền vững cho toàn bộ công trình.',
    features: [
      'Chôn móng, cọc khoan nhồi',
      'Phần thô nhà phố, biệt thự',
      'Nhà xưởng công nghiệp',
      'Kết cấu bê tông cốt thép',
      'Kiểm soát chất lượng từng công đoạn',
    ],
    includes: [
      'Định vị công trình, móng, cột, dầm, sàn và mái',
      'Thi công tường bao, tường ngăn và cầu thang',
      'Lắp đặt hệ thống điện nước âm theo bản vẽ',
      'Nghiệm thu kết cấu theo từng giai đoạn',
    ],
    process: [
      'Kiểm tra hồ sơ kỹ thuật và mặt bằng',
      'Triển khai móng, khung kết cấu và xây tô',
      'Kiểm tra cao độ, kích thước và chất lượng bê tông',
      'Bàn giao phần thô sẵn sàng cho hoàn thiện',
    ],
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=70',
  },
];

const seedServices = async () => {
  try {
    for (const [index, service] of services.entries()) {
      await Service.findOneAndUpdate(
        { slug: service.slug },
        {
          ...service,
          status: 'published',
          order: index,
          seo: {
            title: `${service.title} | Dịch vụ Quân Bảo`,
            description: service.description,
            ogImage: service.image,
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      );
    }

    console.log(`Seeded ${services.length} services`);
  } catch (error) {
    console.error('Error seeding services:', error.message);
    throw error;
  }
};

module.exports = seedServices;
