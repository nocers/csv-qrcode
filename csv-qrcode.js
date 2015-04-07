/**
 * csv-qrcode
 * @param fliePath: csv文件路径
 * @param delimiter: 分隔符，默认为逗号
 * @param urlColNum: url所在的列，默认在第2列
 * @param picColNum: 二维码图片命名所在的列
 * @param typeNumber: 1 to 10   默认为4
 * @param errorCorrectLevel: 'L','M','Q','H'  默认为M
 * @param isLogo: 是否添加logo水印   默认为false
 * @param logoPath: 添加logo时logo所在的路径 
 * @param imagePath: 产生图片存放路径   默认为当前目录
 * @param cellSize: 调整二维码的像素大小，默认一个点占10个像素
 * @param margin: 调整二维码图片的外围margin，默认为cellSize的两倍
 * @param ext: 图片格式，默认为png，logo图标只支持png和jpg
 * @param scale: 二维码图片与logo的宽度比例，默认为5，越小logo越大
 */
 /*
 var options = {
	filePath:'csv路径',
	delimiter:'分隔符',
	urlColNum:'url所在的列',
	picColNum:'图片所在的列',
	typeNumber:'二维码尺寸1-10',
	errorCorrectLevel:'错误修正L M Q H',
	isLogo:'是否添加logo图标',
	logoPath:'logo所在路径',
	imagePath:'图片存放路径',
	cellSize:'每个点占几个像素',
	margin:'图片外圈白边宽度',
	ext:'图片格式',
	scale:'logo与二维码的比例因子'
}
*/
var filePath, delimiter, urlColNum, picColNum, typeNumber, errorCorrectLevel, isLogo, logoPath, imagePath, cellSize, margin, ext, scale;
exports.csv_qrcode = function(options){
	filePath = options.filePath;
	delimiter = options.delimiter != null ? options.delimiter : ',';
	urlColNum = options.urlColNum != null ? options.urlColNum-1 : 1;
	picColNum = options.picColNum != null ? options.picColNum-1 : 0;
	typeNumber = options.typeNumber != null ? options.typeNumber : '4';
	errorCorrectLevel = options.errorCorrectLevel != null ? options.errorCorrectLevel : 'M';
	isLogo = options.isLogo != null ? options.isLogo : false;
	logoPath = options.logoPath;
	imagePath = options.imagePath !=null ? options.imagePath : './';
	cellSize = options.cellSize != null ? options.cellSize : 10;
	margin = options.margin != null ? options.margin : 2*cellSize;
	ext = options.ext != null ? options.ext : 'png';
	scale = options.scale != null ? options.scale : 5;
	var fs = require('fs');
	var parse = require('csv-parse');
	var transform = require('stream-transform');
	var output = [];
	var parser = parse({delimiter: ','})
	if(!fs.existsSync(filePath)){
		console.log('csv file not exist');
		return false;
	}
	if(!fs.existsSync(imagePath)){
		fs.mkdirSync(imagePath);
	}
	if(isLogo){
		if(!fs.existsSync(logoPath)){
			console.log('logo file not exist');
			return false;
		} else{

		}
	}
	var input = fs.createReadStream(filePath);
	var images = require('images');
	//var urls = [], pics = [];
	var transformer = transform(function(record){
		//urls.push(record[urlColNum]);
		//pics.push(record[picColNum]);
		var base64Data = generateCode(record[urlColNum],typeNumber,errorCorrectLevel,cellSize,margin);
		var picName = record[picColNum];
		var picPath = imagePath+'/'+picName;
		require("fs").writeFile(picPath+'.gif', base64Data, 'base64', function(err) {
			if(err){
				console.log('file save error');
				return false;
			}
			var qrImages = images(picPath+'.gif');
			if(isLogo){
				var logoTemp;
				var logoImages = images(logoPath);					
				
				var qrHeight = qrImages.height();
				var qrWidth = qrImages.width();
				var scaleWidth = Math.ceil(qrWidth/scale);
				if(!logoTemp){
					logoTemp = logoPath.substr(0,logoPath.lastIndexOf('.'))+'_scale'+logoPath.substr(logoPath.lastIndexOf('.'));
					logoImages.size(scaleWidth).save(logoTemp);
				}
				var drawPosition = {x:Math.ceil((qrWidth-scaleWidth)/2),y:Math.ceil((qrHeight-scaleWidth)/2)};
				logoImages = images(logoTemp);
				qrImages.draw(logoImages,drawPosition.x,drawPosition.y).save(picPath+'.'+ext);
			}else{
				qrImages.save(picPath+'.'+ext);
			}
			images.gc();
		});
	});
	input.pipe(parser).pipe(transformer);
}
function generateCode(data,typeNumber,errorCorrectLevel,cellSize,margin)
{
	var QRCode = require('qrcode-npm')
  	var qr = QRCode.qrcode(typeNumber, errorCorrectLevel);
	qr.addData(data);
	qr.make();
	var qrimgtag = qr.createImgTag(cellSize,margin);
	//console.log(qrimgtag);
	var idx=qrimgtag.indexOf("base64,") + 7;
	qrimgtag  = qrimgtag.substring(idx);
	idx = qrimgtag.indexOf("\"");
	return qrimgtag.substring(0,idx);
}
