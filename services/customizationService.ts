import { supabase } from '../supabaseClient';
import { CustomizationData, Order } from '../types';

/**
 * Fetches order details by ID.
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

/**
 * Uploads the preview image to Supabase Storage.
 */
export const uploadPreviewImage = async (orderId: string, dataUrl: string): Promise<string | null> => {
  try {
    // Convert base64 to Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = `${orderId}/preview-${Date.now()}.png`;

    // Assume bucket name is 'designs' based on the requirement context, or 'public'
    const { data, error } = await supabase.storage
      .from('personalizacoes_previews') // Ensure this bucket exists in Supabase
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('personalizacoes_previews')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

/**
 * Saves the final customization data to the database.
 */
export const saveCustomization = async (
  orderId: string, 
  customizationData: CustomizationData, 
  previewUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('personalizacoes')
      .insert({
        pedido_id: orderId,
        dados: customizationData,
        preview_url: previewUrl,
        criado_em: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving customization:', error);
    return false;
  }
};
