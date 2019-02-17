const fs = require('fs');
const fetch = require('node-fetch');
const request = require('request-promise');
const cheerio = require('cheerio');



async function Relais_Scrap(){ 
		var relais_hotel = [];
		await request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, respons,html) => {
			const $ = cheerio.load(html);	
				$('#countryF',html).find("h3:contains('France')").parent().find(".listDiamond > li").each(function(index){
						const url = $(this).find("a").first()[0].attribs.href;
						relais_hotel.push(url);
						
					});				
					fs.writeFile('hotelURL.json', JSON.stringify(relais_hotel, null, 4), function(err){
				})
		});
		return relais_hotel;
}


async function Resto_Etoilé(){ 
		console.log('Opération de récupération des restaurants étoilés. Cette opération va prendre du temps. Veuilez patienter')
		var restaurants = [];
		var relais_hotel = await Relais_Scrap();
		
		for (const url of relais_hotel){
			await request(url, (error, respons,html) => {
				const $ = cheerio.load(html);
						
				if ($('li.active > a',html).data('id')=='isProperty' && $('.jsSecondNavMain > li:nth-child(2) > a',html).data('id').includes('isRestaurant')) {
						var nom = $('picture > img', html).attr('alt');
						var etoile = $('title', html).first().text();
						
						if (etoile.includes('étoile')){
							if(etoile.includes('1 étoile')) etoile = '1 étoile';
							if(etoile.includes('2 étoile')) etoile = '2 étoile';
							if(etoile.includes('3 étoile')) etoile = '3 étoile';
							
							var obj = {'name' : nom, "star" : etoile};
							restaurants.push(obj);
							
							fs.writeFile('Resto_Etoilé.json', JSON.stringify(restaurants, null, 4), function(err){
							})
						} 
							
						
				}
						
		});				
		
	}
	console.log('L opération est terminée. Vous pourrez retrouver les restaurants étoilés dans le fichier JSON Resto_Etoilé');
}


Relais_Scrap();
console.log('Vous pourrez trouver les url de tous les hotels dans le fichier hotelURL.json');
Resto_Etoilé();

