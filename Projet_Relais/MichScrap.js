const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

var URLs = []; 
var nom, cuisine, prix;
var mich_restaurant = [];

function Recup_URL(){
	for(var i = 1; i < 36; i++){
		URLs[i-1] = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i;
			}
	}


function Scrap_Michelin(){
	for (var i=0; i<URLs.length; i++){
		request(URLs[i], (error, respons,html) => {
			const $ = cheerio.load(html);
				$('ul.poi-search-result li a').each(function() {
										const nom = $(this).find('div.poi_card-display-title').text().replace(/\s\s+/g,'');
										const cuisine = $(this).find('div.poi_card-display-cuisines').text().replace(/\s\s+/g,'');
										const prix = $(this).find('div.poi_card-display-price').text().replace(/\s\s+/g,'');
										var obj = {nom: nom, cuisine: cuisine, prix : prix};  
										mich_restaurant.push(obj);
								});					
				fs.writeFile('InfoResto.json', JSON.stringify(mich_restaurant, null, 4), function(err){
				})
		});
	}
	console.log('Vous pouvez retrouver les informations des restaurants Michelin dans le fichier JSON InfoResto')
}


Recup_URL();
Scrap_Michelin();
