import { useMDXComponents } from 'nextra-theme-docs';
import { generateStaticParamsFor, importPage } from 'nextra/pages';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
};

// biome-ignore lint/correctness/useHookAtTopLevel: false positive, useMDXComponents are not react hooks
const Wrapper = useMDXComponents().wrapper;

export default async function Page(props) {
  const params = await props.params
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
};
