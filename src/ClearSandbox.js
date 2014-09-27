/**
 * Script to clear the Sandbox
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 */
( function ( mw, $ ) {
	'use strict';

	var page = {
			ptwikibooks: [
				'Wikilivros:Caixa_de_areia',
				'<noinclude>{' + '{sandbox}}<!-- escreva abaixo se faz favor' +
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

	function clearSandbox() {
		( new mw.Api() ).post({
			action: 'edit',
			title: page[0],
			text: page[1],
			summary: page[2],
			minor: true,
			watchlist: 'nochange',
			token: mw.user.tokens.get( 'editToken' )
		})
		.done( function ( data ) {
			if ( data && data.edit && data.edit.result && data.edit.result === 'Success' ) {
				mw.notify( 'A página foi editada' );
			} else {
				mw.notify( 'Houve um erro ao tentar editar' );
			}
		});
	}

	function addClearLink() {
		$(mw.util.addPortletLink(
			'p-views',
			'#',
			'Limpar',
			'ca-clear',
			'Limpar a página'
		)).click(function (e) {
			e.preventDefault();
			mw.loader.using( 'mediawiki.api.edit', clearSandbox );
		});
	}

	if ( page && mw.config.get( 'wgPageName' ) === page[0] ) {
		$(addClearLink);
	}

}( mediaWiki, jQuery ) );
