import mongoose, { Document, Schema } from 'mongoose';
import ICategory from '../Category/Category.model';

export interface IProduct extends Document {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  salePercent: number;
  isSale: boolean;
  category: string[];
  rating: number;
  isVisible: boolean;
  shortDesc: string;
  longDesc: string;
  updatedAt: Date;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: ['https://placehold.co/600x400'],
  },
  salePercent: {
    type: Number,
    default: 0,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  category: {
    type: [String],
    ref: 'Category',
    default: ['Ban'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  shortDesc: {
    type: String,
    default: `
	<p><strong>Kích thước:</strong> Tủ Đầu Giường: Dài 45 x Rộng 40 x Cao 40 cm</p>
<p><strong>Chất liệu chính:&nbsp;</strong>Gỗ cao su và gỗ MFC/ MDF phủ Melamin chuẩn CARB P2 (*)</p>
<p><em>(*) Tiêu chuẩn California Air Resources Board xuất khẩu Mỹ, đảm bảo gỗ không độc hại, an toàn cho sức khỏe</em></p>
<p>&nbsp;</p>
`,
  },
  longDesc: {
    type: String,
    default: `
<h2><strong>Thông số kỹ thuật</strong></h2><p>Dài 45 x Rộng 40&nbsp;x Cao 40&nbsp;cm</p><p style="text-align: center"><img alt="tủ đầu giường" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/160_cm__1__2048x2048.png" src="//file.hstatic.net/200000065946/file/160_cm__1__2048x2048.png"></p><h2><strong>Chi tiết nguyên vật liệu</strong></h2><p>Với tiêu chí ưu tiên là bảo vệ môi trường và cung cấp những sản phẩm an toàn, tốt cho sức khỏe của con người, MOHO đã cân nhắc và chọn lọc sử dụng những nguyên liệu tốt nhất trong từng sản phẩm. Bộ sưu tập Grenaa được làm từ 2 nguyên liệu chính: gỗ công nghiệp MDF/ MFC phủ Melamine đạt chuẩn CARB P2 và gỗ cao su.</p><p><em><strong>Gỗ công nghiệp MDF/ MFC phủ Melamine</strong></em></p><p>Sử dụng Gỗ công nghiệp ván ép&nbsp;phủ Melamine vừa giúp bảo vệ môi trường, vừa tăng khả năng chống trầy xước mà vẫn đảm bảo kết cấu chắc chắn, bền bỉ cho sản phẩm. Đặc biệt, đạt tiêu chuẩn CARB P2 rất an toàn cho sức khỏe của bạn và gia đình.</p><p><em><strong>Gỗ cao su</strong></em><br>Sử dụng gỗ cao su cho phần chân và khung giúp tăng khả năng chịu lực và độ bền cao hơn, dẻo dai hơn.</p><h2><strong>Đặc điểm chi tiết sản phẩm</strong></h2><p>Bộ sưu tập Grenaa sẽ đưa bạn đến một hành trình đầy ấn tượng giữa vẻ đẹp tinh tế và sự hiện đại tối giản của phong cách Scandinavian. Được truyền cảm hứng từ thị trấn Đan Mạch cùng tên, sự lạnh lẽo của thị trấn ven biển Baltic giá lạnh quanh năm đã được chuyển hóa thành sự tinh tế hiện đại trong các món đồ nội thất với màu sắc trầm lạnh.</p><p>Trong bộ sưu tập này, chúng tôi đã mang lại cho khách hàng một phong cách Scandinavian hoàn chỉnh, mang đậm đặc trưng của Đan Mạch nói riêng và các nước Bắc&nbsp;âu nói riêng. Toàn bộ sản phẩm mang tông màu tối lạnh của vùng biển Baltic, nhưng đã được chăm chút tỉ mỉ trong thiết kế khiến cho bộ sưu tập Grenaa vô cùng hài hòa không kém phần ấm áp.<br><br>Không những vậy, chúng tôi cũng đã tích hợp các công năng vào sản phẩm. Tủ đầu giường Grenaa không chỉ hiện đại về mặt thiết kế mà còn cả khả năng sử dụng. GRENAA&nbsp;sẽ mang lại không gian sống nhẹ nhàng, gần gũi, nơi vẻ đẹp và sự đơn giản yên bình của ngôi nhà trở thành một.</p><ul><li><p>Thiết kế đơn giản, tinh tế và kiểu dáng nhỏ gọn sẽ giúp tiết kiệm tối ưu hóa không gian lưu trữ đặc biệt giúp góc nhỏ nhà bạn đẹp và tiện ích hơn.</p></li></ul><p style="text-align: center"><img alt="Tủ đầu giường Grenaa" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/456116807_824721296510725_8445661025539465257_n_2048x2048.jpg" src="//file.hstatic.net/200000065946/file/456116807_824721296510725_8445661025539465257_n_2048x2048.jpg"></p><p>Được làm từ gỗ công nghiệp MFC và khung gỗ cao su tạo nên một kết cấu chắc chắn, bền bỉ.</p><p style="text-align: center"><img alt="Tủ đầu giường Grenaa" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/pro_nau_noi_that_moho_tu_dau_giuong_grenaa_2_2048x2048.png" src="//file.hstatic.net/200000065946/file/pro_nau_noi_that_moho_tu_dau_giuong_grenaa_2_2048x2048.png"></p><p style="text-align: center"><img alt="Tủ đầu giường Grenaa" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/pro_nau_noi_that_moho_tu_dau_giuong_grenaa_4_2048x2048.png" src="//file.hstatic.net/200000065946/file/pro_nau_noi_that_moho_tu_dau_giuong_grenaa_4_2048x2048.png"></p><p style="text-align: center"><img alt="Tủ đầu giường Grenaa" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/466144107_882217257427795_3970960954708038593_n_2048x2048.jpg" src="//file.hstatic.net/200000065946/file/466144107_882217257427795_3970960954708038593_n_2048x2048.jpg"></p><p>&nbsp;</p>
<div class="page-content">
	<p style="text-align: center"><img alt="lưu ý sản phẩm" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/z5471796383575_afe7fc65369226b8a41e290b216221a0_8504ff911dc3451f8a83b3e4e5dde388_2048x2048.jpg" src="//file.hstatic.net/200000065946/file/z5471796383575_afe7fc65369226b8a41e290b216221a0_8504ff911dc3451f8a83b3e4e5dde388_2048x2048.jpg"></p><p style="text-align: center"><img alt="Nội Thất MOHO" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/noi-that-moho-100-viet-nam_06bcf2c208a943598bdef46d09d2537f.jpg" src="//file.hstatic.net/200000065946/file/noi-that-moho-100-viet-nam_06bcf2c208a943598bdef46d09d2537f.jpg"></p><p style="text-align: center"><img alt="Nội thất MOHO" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/text1-1__1__4d8490750feb4fef86a28f141bbd0960_2048x2048_ac5a5fcb1e764c9282e75c1d776242b1.jpg" src="//file.hstatic.net/200000065946/file/text1-1__1__4d8490750feb4fef86a28f141bbd0960_2048x2048_ac5a5fcb1e764c9282e75c1d776242b1.jpg"></p><p style="text-align: center"><img alt="Nội thất MOHO" title="Nội dung sản phẩm" nosrc="//file.hstatic.net/200000065946/file/noi_that_moho_ban_quyen_moho_a29ede9db726454c82cccb850a0efd3d.jpg" src="//file.hstatic.net/200000065946/file/noi_that_moho_ban_quyen_moho_a29ede9db726454c82cccb850a0efd3d.jpg"></p>
</div>			`,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const Product = mongoose.model<IProduct>('Product', ProductSchema);
