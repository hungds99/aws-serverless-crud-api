import UserService from '../services/user';

const userService = new UserService();

export const createUser = async (event: any): Promise<any> => {
  const user = await userService.save(JSON.parse(event.body));
  return { statusCode: 201, body: JSON.stringify(user) };
};

export const getUsers = async (): Promise<any> => {
  const users = await userService.findAll();
  return { statusCode: 200, body: JSON.stringify(users) };
};

export const getUser = async (event: any): Promise<any> => {
  const { id } = event.pathParameters;
  const user = await userService.findById(id);
  return { statusCode: 200, body: JSON.stringify(user) };
};

export const deleteUser = async (event: any): Promise<any> => {
  const { id } = event.pathParameters;
  const user = await userService.deleteById(id);
  return { statusCode: 200, body: JSON.stringify(user) };
};

export const updateUser = async (event: any): Promise<any> => {
  const { id } = event.pathParameters;
  const user = await userService.updateById(id, JSON.parse(event.body));
  return { statusCode: 200, body: JSON.stringify(user) };
};
