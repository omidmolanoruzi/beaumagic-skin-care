-- Expose product_reviews to PostgREST (anon read, service role write)
grant select on public.product_reviews to anon, authenticated;
grant insert on public.product_reviews to service_role;

notify pgrst, 'reload schema';
