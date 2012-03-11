/* Script to clear the Sandbox */
/*global $, jsMsg, mw */
/*jslint white: true */
(function(){
'use strict';

var	page = {
		ptwikibooks: [ 'Wikilivros:Caixa_de_areia', '116378', 'Limpeza' ],
		ptwiki: [ 'Wikipédia:Página_de_testes/1', '29264502', 'Limpeza' ],
		enwiki: [ 'Wikipedia:Sandbox', '481366230', 'Clearing' ]
	}[ mw.config.get( 'wgDBname' ) ],
	api;

function clearSandbox ( text ){
	api.post({
		format: 'json',
		action: 'edit',
		title: page[0],
		text: text,
		summary: page[2],
		minor: true,
		watchlist: 'nochange',
		token: mw.user.tokens.get( 'editToken' )
	}, {
		ok: function( data ) {
			if ( data && data.edit && data.edit.result && data.edit.result === 'Success' ) {
				jsMsg( 'A página foi editada' );
			} else {
				jsMsg( 'Houve um erro ao tentar editar' );
			}
		}
	});
}

function getCleanVersionOfSandbox(){
	api = new mw.Api();
	api.get( {
		action: 'query',
		prop: 'revisions',
		rvprop: 'content',
		rvlimit: 1,
		titles: page[0],
		rvstartid: page[1],
		indexpageids: true
	}, {
		ok: function ( data ) {
			var     q = data.query,
				id = q && q.pageids && q.pageids[0],
				pg = id && q.pages && q.pages[ id ],
				rv = pg && pg.revisions;
			if ( rv && rv[0] && rv[0]['*'] ) {
				clearSandbox( rv[0]['*'] );
			}
		}
	} );
}

function addClearLink (){
	$(mw.util.addPortletLink(
		'p-views',
		mw.util.wikiGetlink() + '?action=edit&oldid=' + page[1],
		'Limpar',
		'ca-clear',
		'Limpar a página'
	)).click(function(e){
		e.preventDefault();
		mw.loader.using( 'mediawiki.api.edit', getCleanVersionOfSandbox );
	});
}

if( page && mw.config.get( 'wgPageName' ) === page[0] ){
	$(addClearLink);
}
}());