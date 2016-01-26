import $ from 'jquery';
import {extend} from '../util/index';

export default {

    methods: {

        matchHeights(elements, options) {

            elements = $(elements).css('min-height', '');
            options = extend({row: true}, options);

            let matchHeights = function (group) {

                if (group.length < 2) return;

                let max = 0;

                group.each(function () {
                    max = Math.max(max, $(this).outerHeight());
                }).each(function () {

                    let element = $(this),
                        height = max - (element.css('box-sizing') == 'border-box' ? 0 : (element.outerHeight() - element.height()));

                    element.css('min-height', height + 'px');
                });
            };

            if (options.row) {

                elements.first().width(); // force redraw

                setTimeout(function () {

                    let lastoffset = false, group = [];

                    elements.each(function () {

                        let ele = $(this), offset = ele.offset().top;

                        if (offset != lastoffset && group.length) {

                            matchHeights($(group));
                            group = [];
                            offset = ele.offset().top;
                        }

                        group.push(ele);
                        lastoffset = offset;
                    });

                    if (group.length) {
                        matchHeights($(group));
                    }

                }, 0);

            } else {
                matchHeights(elements);
            }
        },

        stackMargin(elements, options) {

            options = extend({
                margin: 'uk-margin-small-top'
            }, options);

            options.margin = options.margin;

            elements = $(elements).removeClass(options.margin);

            let skip = false,
                firstvisible = elements.filter(":visible:first"),
                offset = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

            if (offset === false || elements.length == 1) return;

            elements.each(function () {

                let column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass(options.margin);
                    } else {

                        if (column.position().top >= offset) {
                            skip = column.addClass(options.margin);
                        }
                    }
                }
            });
        },

        checkDisplay(context, initanimation) {

            let elements = $('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]', context || document), animated;

            if (context && !elements.length) {
                elements = $(context);
            }

            elements.trigger('display.uk.check');

            // fix firefox / IE animations
            if (initanimation) {

                if (typeof(initanimation) != 'string') {
                    initanimation = '[class*="uk-animation-"]';
                }

                elements.find(initanimation).each(function () {

                    let ele = $(this),
                        cls = ele.attr('class'),
                        anim = cls.match(/uk\-animation\-(.+)/);

                    ele.removeClass(anim[0]).width();

                    ele.addClass(anim[0]);
                });
            }

            return elements;
        }

    }

};