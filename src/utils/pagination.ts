type Param = {
  name?: string;
  value?: string | boolean | number | null;
};

export const addSearchParamsInUrl = (baseUrl: string, ...params: Param[]) => {
  const urlParams = new URLSearchParams();

  params.forEach((param) => {
    if (param?.name && (param?.value || param.value === '')) {
      urlParams.append(param.name, param.value.toString());
    }
  });

  const url = urlParams.toString()
    ? `${baseUrl}?${urlParams.toString()}`
    : baseUrl;
  return url;
};
