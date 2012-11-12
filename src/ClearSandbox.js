/**
 * Script to clear the Sandbox
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/ClearSandbox.js]] ([[File:User:Helder.wiki/Tools/ClearSandbox.js]])
 */
/*jslint browser: true, white: true*/
/*global jQuery, mediaWiki */
( function ( $, mw /* , undefined */ ) {
'use strict';

var	page = {
		ptwikibooks: [
			'Wikilivros:Caixa_de_areia',
			'<noinclude>{{sandbox}}<!-- escreva abaixo se faz favor' +
				' --></noinclude>',
			'Limpeza'
		],
		ptwiki: [
			'Wikipédia:Página_de_testes/1',
			'<!--não apague esta linha-->{' + '{página de testes}}' +
				'<!--não apague esta linha-->\n<!--Escreva abaixo' +
				' da linha! -------------------------------- -->',
			'Limpeza'
		],
		enwiki: [
			'Wikipedia:Sandbox',
			'{' + '{Please leave this line alone (sandbox heading)}}\n' +
				'<!-- Hello! Feel free to try your formatting and' +
				' editing skills below this line. As this page is' +
				' for editing experiments, this page will' +
				' automatically be cleaned every 12 hours. -->',
			'Cleaning'
		]
	}[ mw.config.get( 'wgDBname' ) ];

function clearSandbox (){
	var api = new mw.Api();
	api.post({
		action: 'edit',
		title: page[0],
		text: page[1],
		summary: page[2],
		minor: true,
		watchlist: 'nochange',
		token: mw.user.tokens.get( 'editToken' )
	})
	.done( function( data ) {
		if ( data && data.edit && data.edit.result && data.edit.result === 'Success' ) {
			mw.notify( 'A página foi editada' );
		} else {
			mw.notify( 'Houve um erro ao tentar editar' );
		}
	});
}

function addClearLink (){
	$(mw.util.addPortletLink(
		'p-views',
		'#',
		'Limpar',
		'ca-clear',
		'Limpar a página'
	)).click(function(e){
		e.preventDefault();
		mw.loader.using( 'mediawiki.api.edit', clearSandbox );
	});
}

if( page && mw.config.get( 'wgPageName' ) === page[0] ){
	$(addClearLink);
}

}( jQuery, mediaWiki ) );