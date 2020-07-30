'use strict';
// Class definition

var KTDatatableDataLocalDemo = function() {
	// Private functions

	// demo initializer
	var demo = function() {
			var datatable = $('.kt_datatable').KTDatatable({
			// datasource definition
			// data: {
			// 	type: 'local',
			// 	source: dataJSONArray,
			// },
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'https://heroku-stock-info.herokuapp.com/filtered_list',
						method: 'GET',
						map: function(raw) {
							// sample data mapping
							var dataSet = raw;
							if (typeof raw.data !== 'undefined') {
								dataSet = raw.data;
							}
							return dataSet;
						},
					},
				},
			},

			// layout definition
			layout: {
				scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
				minHeight: 400,
				height: 400, // datatable's body's fixed height
				footer: false, // display/hide footer
			},

			// column sorting
			sortable: true,

			pagination: false,

			rows: {
				autoHide: false,
			},

			// columns definition
			columns: [
				{
					field: '股票代號',
					title: '股票代號',
					// locked: {left: 'xl'},
				}, {
					field: '股票名稱',
					title: '股票名稱',
				}, {
					field: '多頭回檔尚未跌破5MA後上漲',
					title: '多頭回檔尚未跌破5MA後上漲',
					// template: function(row) {
					// 	var status = {
					// 		尚未收盤過昨高: {'title': '尚未收盤過昨高', 'class': 'green_bg'},
					// 		收盤過昨高再上漲: {'title': '收盤過昨高再上漲', 'class': 'red_bg'},
					// 	};
					// 	// console.log(row);
					// 	return '<span class="' + status[row.多頭回檔尚未跌破5MA後上漲].class + '">' + status[row.多頭回檔尚未跌破5MA後上漲].title + '</span>';
					// },
				}, {
					field: '當前收盤價',
					title: '當前收盤價',
				}, {
					field: '當前收盤漲跌幅',
					title: '當前收盤漲跌幅',
				}, {
					field: '收盤V.S昨高低',
					title: '收盤V.S昨高低',
				}, {
					field: '實體K線',
					title: '實體K線',
				}, {
					field: '量增減',
					title: '量增減',
				},{
					field: '日線趨勢架構',
					title: '日線趨勢架構',
				},{
					field: '周線趨勢架構',
					title: '周線趨勢架構',
				},{
					field: '上漲強度',
					title: '上漲強度',
				},{
					field: '回檔強度',
					title: '回檔強度',
				},{
					field: '外資1日累積買賣超',
					title: '外資1日累積買賣超',
				}, {
					field: '外資3日累積買賣超',
					title: '外資3日累積買賣超',
				},{
					field: '外資5日累積買賣超',
					title: '外資5日累積買賣超',
				},{
					field: '外資前一日買超排行榜TOP30',
					title: '外資前一日買超排行榜TOP30',
				},{
					field: '外資前一日賣超排行榜TOP30',
					title: '外資前一日賣超排行榜TOP30',
				},{
					field: '投信1日累積買賣超',
					title: '投信1日累積買賣超',
				},{
					field: '投信3日累積買賣超',
					title: '投信3日累積買賣超',
				},{
					field: '投信5日累積買賣超',
					title: '投信5日累積買賣超',
				},{
					field: '投信昨日買超排行榜TOP30',
					title: '投信昨日買超排行榜TOP30',
				},{
					field: '投信昨日賣超排行榜TOP30',
					title: '投信昨日賣超排行榜TOP30',
				}],
		});
	};

	return {
		// Public functions
		init: function() {
			// init dmeo
			demo();
		}
	};
}();

var totalRowsNum = 0;
var stockIdList = [];

function requestInfo() {
	for (var index = 0; index < totalRowsNum; index++) {
		$.get('https://cors-anywhere.herokuapp.com/https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stockIdList[index]+'.tw', function(data) {
			var jsonRes = $.parseJSON(data);
			var latestPrice = jsonRes["msgArray"][0]['z'];
			//latestPrice = latestPrice.split('_')[0];
			//console.log(latestPrice);
			var rowIndex = stockIdList.indexOf(jsonRes["msgArray"][0]['c']);
			//console.log(rowIndex);
			if (rowIndex != -1) {
				$('.kt_datatable tbody tr:eq(' + rowIndex + ') td:eq(2) span').html(latestPrice);
			}
		});
	}
}

function checkColor() {
	for (var index = 0; index < totalRowsNum; index++) {
		$.get('https://cors-anywhere.herokuapp.com/https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stockIdList[index]+'.tw', function(data) {
			var jsonRes = $.parseJSON(data);
			var latestPrice = jsonRes["msgArray"][0]['z'];
			//latestPrice = latestPrice.split('_')[0];
			//console.log(latestPrice);
			var rowIndex = stockIdList.indexOf(jsonRes["msgArray"][0]['c']);
			//console.log(rowIndex);
			if (rowIndex != -1) {
				$('.kt_datatable tbody tr:eq(' + rowIndex + ') td:eq(2) span').html(latestPrice);
			}
		});
	}
}

jQuery(document).ready(function() {
	KTDatatableDataLocalDemo.init();

	setTimeout(function () {
		totalRowsNum = $('.kt_datatable').KTDatatable().getDataSet().length;
		stockIdList = [];
		for (var index = 0; index < totalRowsNum; index++) {
			stockIdList.push(
				$('.kt_datatable tbody tr:eq(' + (index+1) + ') td:eq(0) span').text()
			);
		}
		console.log("price request!");
		setInterval(requestInfo, 5000);
	}, 10000);
	setTimeout(function () {
		totalRowsNum = $('.kt_datatable').KTDatatable().getDataSet().length;
		stockIdList = [];
		for (var index = 0; index < totalRowsNum; index++) {
			var upTxt = $('.kt_datatable tbody tr:eq(' + index + ') td:eq(2) span').text();
			// console.log(upTxt);
			switch (upTxt) {
				case "收盤過昨高再上漲":
					$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').removeClass("red_bg").removeClass("green_bg");
					$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').addClass("red_bg");
					break;
				case "尚未收盤過昨高":
					$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').removeClass("red_bg").removeClass("green_bg");
					$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').addClass("green_bg");
					break;
			}
			// if (upTxt == "收盤過昨高再上漲") {
			// 	$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').removeClass("red_bg").removeClass("green_bg");
			// 	$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').addClass("red_bg");
				
			// }
			// else if(upTxt == "尚未收盤過昨高"){
			// 	$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').removeClass("red_bg").removeClass("green_bg");
			// 	$('.kt_datatable tbody tr:eq(' + index + ') td:eq(2)').addClass("green_bg");
			// 	return;
			// }
		}
    }, 5000);
});