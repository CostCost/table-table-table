Component({
  properties: {
    // icon-WeChat | icon-fenxiang | icon-home | icon-screenfull | icon-fanhui | icon-ic_sett_about | icon-ic_sett_calc_round | icon-ic_sett_sort | icon-ic_sett_base | icon-ic_sett_grid_form | icon-ic_sett_lang | icon-ic_sett_photo | icon-ic_sett_other | icon-ic_search | icon-ic_sett_text_size | icon-ic_sett_calc | icon-ic_sett_image | icon-ic_sett_spectr | icon-ic_sett_pt | icon-ic_sett_version | icon-ic_sett_calc_hand | icon-ic_share_human | icon-ic_sett_error | icon-ic_spinner_caret | icon-ic_sett_sun | icon-ic_smile_search | icon-ic_star | icon-ic_read_sort_icon | icon-ic_note | icon-ic_perc | icon-ic_pen | icon-ic_like_white | icon-ic_kation1 | icon-ic_kation2 | icon-ic_kation3 | icon-ic_history | icon-ic_helper | icon-ic_filter | icon-ic_filter_all | icon-ic_filter_name | icon-ic_filter_massa | icon-ic_filter_cas | icon-ic_filter_electrootric | icon-ic_filter_number | icon-ic_filter_electro | icon-ic_filter_electron | icon-ic_filter_plot | icon-ic_filter_symbol | icon-ic_filter_radius | icon-ic_filter_toolbar | icon-ic_filter_year | icon-ic_el_obolochka1 | icon-ic_el_obolochka2 | icon-ic_drag2 | icon-ic_dot | icon-ic_drag | icon-ic_delete_favorite | icon-ic_delete | icon-ic_description | icon-ic_crown_gold | icon-ic_copy | icon-ic_close_dr | icon-ic_bookmark | icon-ic_atom | icon-ic_brackets | icon-ic_array_vector2 | icon-ic_array_vector3 | icon-ic_array_vector0 | icon-ic_array_vector1 | icon-ic_array_vector4 | icon-ic_about_like | icon-find_reactions_atom | icon-design_ic_visibility_off | icon-electron_shell_icon | icon-arrow_to_bottom | icon-arrow_to_right | icon-arrow_to_left | icon-abc_ic_ab_back_material | icon-abc_ic_clear_material | icon-abc_ic_menu_overflow_material | icon-ts0 | icon-ts3 | icon-ts2 | icon-ic_wikipedia | icon-ic_translate | icon-ic_untitled_image | icon-read_favorite | icon-read8_atom | icon-read1_atom | icon-read11_resh | icon-read3_earth | icon-read2_temp | icon-read4_color | icon-read5_manet | icon-read6_reaction | icon-read7_yader | icon-ic_tab1 | icon-ic_tab5 | icon-ic_tab2 | icon-ic_tab3 | icon-ic_tab4_1 | icon-angle-down | icon-angle-up | icon-angle-right | icon-angle-left
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
