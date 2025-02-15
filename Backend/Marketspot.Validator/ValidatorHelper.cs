﻿using Marketspot.Model;
using System.Net;
using System.Reflection;

namespace Marketspot.Validator
{
    public class ValidatorHelper
    {
        public static async Task<bool> ValidateDto<T>(T dto, ApiResponse response)
        {
            bool validResult = true;
            try
            {
                string validatorName = dto.GetType().Name.Replace("Dto", "Validator");
                Assembly assemblyValidator = Assembly.Load("Marketspot.Validator");
                Type type = assemblyValidator.DefinedTypes.Where(x => x.Name == validatorName).First();
                object validator = Activator.CreateInstance(type);

                MethodInfo method = validator.GetType().GetMethod("ValidateAsync", [dto.GetType(), typeof(CancellationToken)]);

                Task validation = (Task)method.Invoke(validator, [dto, new CancellationToken()]);
                await validation;
                var result = validation.GetType().GetProperty("Result").GetValue(validation);
                if (!Convert.ToBoolean(result.GetType().GetProperty("IsValid").GetValue(result)))
                {
                    var errors = (result.GetType().GetProperty("Errors").GetValue(result) as IEnumerable<object>);
                    response.ErrorsMessages.AddRange(errors.Select(x => x.ToString()));
                    validResult = false;
                }
            }
            catch (Exception e)
            {
                validResult = false;
                Console.WriteLine(e.Message);
            }
            return validResult;
        }
        public static bool CheckIfExists<T>(T item, ApiResponse response)
        {
            if (item is null)
            {
                response.SetStatusCode(HttpStatusCode.NotFound);
                response.ErrorsMessages.Add($"{typeof(T).Name} was not found.");
                return false;
            }
            return true;
        }
    }
}
