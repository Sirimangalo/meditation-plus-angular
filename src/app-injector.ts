let appInjectorRef;

export const appInjector:any = (injector = false) => {
  if (!injector) {
    return appInjectorRef;
  }

  appInjectorRef = injector;

  return appInjectorRef;
};