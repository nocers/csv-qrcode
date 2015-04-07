# csv-qrcode
解析csv文件获取url产生qrcode，可添加logo图标
参数如下：
 fliePath: csv文件路径
 delimiter: 分隔符，默认为逗号
 urlColNum: url所在的列，默认在第2列
 picColNum: 二维码图片命名所在的列
 typeNumber: 1 to 10   默认为4
 errorCorrectLevel: 'L','M','Q','H'  默认为M
 isLogo: 是否添加logo水印   默认为false
 logoPath: 添加logo时logo所在的路径 
 imagePath: 产生图片存放路径   默认为当前目录
 cellSize: 调整二维码的像素大小，默认一个点占10个像素
 margin: 调整二维码图片的外围margin，默认为cellSize的两倍
 ext: 图片格式，默认为png，logo图标只支持png和jpg
 scale: 二维码图片与logo的宽度比例，默认为5，越小logo越大
 
 example：
 var cq = require('csv-qrcode');
 cq.csv_qrcode({filePath:'test.csv',imagePath:'image',isLogo:true,logoPath:'logo.png'});
 
