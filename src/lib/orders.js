const ORDERS_ENDPOINT = import.meta.env.VITE_ORDERS_ENDPOINT
  || 'https://script.google.com/macros/s/AKfycbxvGQpzGvlTKJ07CseX5Zi2R-_uD-0hgj8e23zXFK-WUSX2G87cENbpnvNZj-_PffSC/exec';

export const createOrderId = () => `MRB-${crypto.randomUUID()}`;

function checkOrderSaved(orderId) {
  return new Promise((resolve, reject) => {
    const callbackName = `__marubiStatus${crypto.randomUUID().replaceAll('-', '')}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => finish(new Error('No se pudo confirmar el pedido')), 12000);

    function finish(error, saved) {
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
      if (error) reject(error);
      else resolve(saved);
    }

    window[callbackName] = (saved) => finish(null, saved === true);
    script.onerror = () => finish(new Error('No se pudo consultar el pedido'));
    const url = new URL(ORDERS_ENDPOINT);
    url.searchParams.set('callback', callbackName);
    url.searchParams.set('orderId', orderId);
    script.src = url.toString();
    document.head.append(script);
  });
}

export async function saveOrder(order) {
  if (!ORDERS_ENDPOINT) throw new Error('El registro de pedidos no está configurado');
  await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(order),
  });
  if (!(await checkOrderSaved(order.orderId))) {
    throw new Error('No se encontró el pedido en el registro');
  }
}
