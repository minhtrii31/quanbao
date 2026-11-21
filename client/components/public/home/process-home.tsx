const steps = [
  {
    title: "Khảo sát",
    description:
      "Tiếp nhận nhu cầu, xem xét hiện trạng và xác định phạm vi công việc.",
  },
  {
    title: "Phương án & dự toán",
    description:
      "Thống nhất thiết kế, vật tư, chi phí và tiến độ trước khi thi công.",
  },
  {
    title: "Thi công",
    description:
      "Triển khai theo hồ sơ, kiểm tra chất lượng và cập nhật từng giai đoạn.",
  },
  {
    title: "Bàn giao",
    description: "Nghiệm thu hạng mục, bàn giao và bảo hành theo thỏa thuận.",
  },
];

export default function ProcessHome() {
  return (
    <section className="section-space border-y border-border bg-muted/50">
      <div className="site-container">
        <h2 className="section-title mb-10">Từ khảo sát đến bàn giao</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-5">
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
              <h3 className="mb-3 mt-5 text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
