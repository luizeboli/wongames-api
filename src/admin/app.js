import favicon from './extensions/favicon.png';
import logo from './extensions/logo.png';

export default {
  config: {
    auth: {
      logo: logo,
    },
    head: {
      favicon: favicon,
    },
    menu: {
      logo: logo,
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Won Games!',
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'app.components.LeftMenu.navbrand.title': 'Dashboard',
      },
    },
    tutorials: false,
  },
  bootstrap() {},
};
